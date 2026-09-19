const pool = require('../config/db');

// Modelo de la tabla `venta`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'venta';
const PK = 'id_venta';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { id_usuario, id_orden_servicio, fecha_venta, total, id_metodo_pago, estado } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (id_usuario, id_orden_servicio, fecha_venta, total, id_metodo_pago, estado) VALUES (?, ?, ?, ?, ?, ?)`,
    [id_usuario, id_orden_servicio, fecha_venta, total, id_metodo_pago, estado]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { id_usuario, id_orden_servicio, fecha_venta, total, id_metodo_pago, estado } = data;
  await pool.query(
    `UPDATE ${TABLE} SET id_usuario = ?, id_orden_servicio = ?, fecha_venta = ?, total = ?, id_metodo_pago = ?, estado = ? WHERE ${PK} = ?`,
    [id_usuario, id_orden_servicio, fecha_venta, total, id_metodo_pago, estado, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
