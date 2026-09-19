const pool = require('../config/db');

// Modelo de la tabla `detalle_orden_servicio`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'detalle_orden_servicio';
const PK = 'id_detalle_orden';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { id_orden_servicio, id_servicio, precio, cantidad, id_repuesto } = data;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await descontarStock(connection, id_repuesto, cantidad);
    const [result] = await connection.query(
      `INSERT INTO ${TABLE} (id_orden_servicio, id_servicio, precio, cantidad, id_repuesto) VALUES (?, ?, ?, ?, ?)`,
      [id_orden_servicio, id_servicio, precio, cantidad, id_repuesto]
    );
    await connection.commit();
    return getById(result.insertId);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function update(id, data) {
  const { id_orden_servicio, id_servicio, precio, cantidad, id_repuesto } = data;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [details] = await connection.query(
      `SELECT id_repuesto, cantidad FROM ${TABLE} WHERE ${PK} = ? FOR UPDATE`,
      [id]
    );
    if (details.length === 0) {
      await connection.rollback();
      return null;
    }

    const previous = details[0];
    await devolverStock(connection, previous.id_repuesto, previous.cantidad);
    await descontarStock(connection, id_repuesto, cantidad);
    await connection.query(
      `UPDATE ${TABLE} SET id_orden_servicio = ?, id_servicio = ?, precio = ?, cantidad = ?, id_repuesto = ? WHERE ${PK} = ?`,
      [id_orden_servicio, id_servicio, precio, cantidad, id_repuesto, id]
    );
    await connection.commit();
    return getById(id);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function remove(id) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [details] = await connection.query(
      `SELECT id_repuesto, cantidad FROM ${TABLE} WHERE ${PK} = ? FOR UPDATE`,
      [id]
    );
    if (details.length === 0) {
      await connection.rollback();
      return false;
    }

    await devolverStock(connection, details[0].id_repuesto, details[0].cantidad);
    await connection.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
    await connection.commit();
    return true;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function descontarStock(connection, idRepuesto, cantidad) {
  if (idRepuesto == null) return;
  const cantidadNumerica = Number(cantidad);
  if (!Number.isInteger(cantidadNumerica) || cantidadNumerica <= 0) {
    const error = new Error('La cantidad del repuesto debe ser un entero positivo');
    error.status = 400;
    throw error;
  }

  const [rows] = await connection.query(
    'SELECT stock FROM repuestos WHERE id_repuesto = ? FOR UPDATE',
    [idRepuesto]
  );
  if (rows.length === 0) {
    const error = new Error('Repuesto no encontrado');
    error.status = 404;
    throw error;
  }
  if (rows[0].stock < cantidadNumerica) {
    const error = new Error('Stock insuficiente para el repuesto');
    error.status = 409;
    throw error;
  }

  await connection.query(
    'UPDATE repuestos SET stock = stock - ? WHERE id_repuesto = ?',
    [cantidadNumerica, idRepuesto]
  );
}

async function devolverStock(connection, idRepuesto, cantidad) {
  if (idRepuesto == null || cantidad == null) return;
  await connection.query(
    'UPDATE repuestos SET stock = stock + ? WHERE id_repuesto = ?',
    [cantidad, idRepuesto]
  );
}

module.exports = { getAll, getById, create, update, remove };
