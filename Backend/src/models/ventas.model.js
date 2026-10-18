const pool = require('../config/db');

// Modelo de la tabla `venta`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'venta';
const PK = 'id_venta';

function getRepuestoItems(data) {
  const items = Array.isArray(data.items) ? data.items : [];
  return items
    .filter((item) => item.id_repuesto !== undefined && item.id_repuesto !== null)
    .map((item) => {
      const idRepuesto = Number(item.id_repuesto);
      const cantidad = Number(item.cantidad);
      const precioUnitario = Number(item.precio_unitario);
      if (!Number.isInteger(idRepuesto) || idRepuesto < 1
        || !Number.isInteger(cantidad) || cantidad < 1
        || !Number.isFinite(precioUnitario) || precioUnitario < 0) {
        throw new Error('Los repuestos de la venta tienen datos inválidos.');
      }
      return { id_repuesto: idRepuesto, cantidad, precio_unitario: precioUnitario };
    });
}

function mapSaleRows(rows) {
  const sales = new Map();
  rows.forEach((row) => {
    let sale = sales.get(row.id_venta);
    if (!sale) {
      sale = {
        id_venta: row.id_venta,
        id_cliente: row.id_cliente,
        id_usuario: row.id_usuario,
        fecha_venta: row.fecha_venta,
        total: row.total,
        id_metodo_pago: row.id_metodo_pago,
        estado: row.estado,
        usuario_nombre: row.cliente_nombre,
        usuario_apellido: row.cliente_apellido,
        metodo_pago_nombre: row.metodo_pago_nombre,
        items: [],
      };
      sales.set(row.id_venta, sale);
    }
    if (row.id_detalle_venta !== null) {
      sale.items.push({
        id_detalle_venta: row.id_detalle_venta,
        id_venta: row.id_venta,
        id_repuesto: row.id_repuesto,
        nombre: row.nombre_repuesto || '',
        cantidad: row.cantidad,
        precio_unitario: row.precio_unitario,
        subtotal: row.subtotal,
      });
    }
  });
  return [...sales.values()];
}

async function getVenta(connection, id) {
  const [rows] = await connection.query(
    `SELECT v.*, c.nombre AS cliente_nombre, c.apellido AS cliente_apellido,
            dv.id_detalle_venta, dv.id_repuesto, dv.cantidad, dv.precio_unitario,
            dv.subtotal, r.nombre AS nombre_repuesto, mp.nombre AS metodo_pago_nombre
       FROM ${TABLE} v
       LEFT JOIN clientes c ON c.id_cliente = v.id_cliente
       LEFT JOIN detalle_venta dv ON dv.id_venta = v.${PK}
       LEFT JOIN repuestos r ON r.id_repuesto = dv.id_repuesto
       LEFT JOIN metodo_pago mp ON mp.id_metodo_pago = v.id_metodo_pago
      WHERE v.${PK} = ?
      ORDER BY dv.id_detalle_venta`,
    [id]
  );
  return mapSaleRows(rows)[0] || null;
}

async function insertItems(connection, saleId, items) {
  for (const item of items) {
    const [result] = await connection.query(
      'UPDATE repuestos SET stock = stock - ? WHERE id_repuesto = ? AND stock >= ?',
      [item.cantidad, item.id_repuesto, item.cantidad]
    );
    if (result.affectedRows === 0) {
      throw new Error(`No hay stock suficiente para el repuesto ${item.id_repuesto}.`);
    }
    await connection.query(
      'INSERT INTO detalle_venta (id_venta, id_repuesto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
      [saleId, item.id_repuesto, item.cantidad, item.precio_unitario, item.cantidad * item.precio_unitario]
    );
  }
}

async function getAll() {
  const [rows] = await pool.query(
    `SELECT v.*, c.nombre AS cliente_nombre, c.apellido AS cliente_apellido,
            dv.id_detalle_venta, dv.id_repuesto, dv.cantidad, dv.precio_unitario,
            dv.subtotal, r.nombre AS nombre_repuesto, mp.nombre AS metodo_pago_nombre
       FROM ${TABLE} v
       LEFT JOIN clientes c ON c.id_cliente = v.id_cliente
       LEFT JOIN detalle_venta dv ON dv.id_venta = v.${PK}
       LEFT JOIN repuestos r ON r.id_repuesto = dv.id_repuesto
       LEFT JOIN metodo_pago mp ON mp.id_metodo_pago = v.id_metodo_pago
      ORDER BY v.fecha_venta DESC, v.${PK} DESC, dv.id_detalle_venta`
  );
  return mapSaleRows(rows);
}

async function getById(id) {
  const connection = await pool.getConnection();
  try {
    return await getVenta(connection, id);
  } finally {
    connection.release();
  }
}

async function create(data) {
  const { id_cliente, fecha_venta, total, id_metodo_pago, estado } = data;
  const items = getRepuestoItems(data);
  const connection = await pool.getConnection();
  let saleId;
  try {
    await connection.beginTransaction();
    const [clients] = await connection.query('SELECT id_usuario FROM clientes WHERE id_cliente = ?', [id_cliente]);
    if (clients.length === 0) throw new Error('El cliente seleccionado no existe.');
    const [result] = await connection.query(
      `INSERT INTO ${TABLE} (id_usuario, id_cliente, fecha_venta, total, id_metodo_pago, estado) VALUES (?, ?, ?, ?, ?, ?)`,
      [clients[0].id_usuario, id_cliente, fecha_venta, total, id_metodo_pago, estado]
    );
    saleId = result.insertId;
    if (estado !== 'cancelada') await insertItems(connection, saleId, items);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  return getById(saleId);
}

async function update(id, data) {
  const { id_cliente, fecha_venta, total, id_metodo_pago, estado } = data;
  const items = getRepuestoItems(data);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [existingSales] = await connection.query(
      `SELECT estado FROM ${TABLE} WHERE ${PK} = ? FOR UPDATE`,
      [id]
    );
    if (existingSales.length === 0) {
      await connection.rollback();
      return null;
    }
    const [clients] = await connection.query('SELECT id_usuario FROM clientes WHERE id_cliente = ?', [id_cliente]);
    if (clients.length === 0) throw new Error('El cliente seleccionado no existe.');
    const [existingItems] = await connection.query(
      'SELECT id_repuesto, cantidad FROM detalle_venta WHERE id_venta = ? FOR UPDATE',
      [id]
    );
    if (existingSales[0].estado !== 'cancelada') {
      for (const item of existingItems) {
        await connection.query(
          'UPDATE repuestos SET stock = stock + ? WHERE id_repuesto = ?',
          [item.cantidad, item.id_repuesto]
        );
      }
    }
    await connection.query('DELETE FROM detalle_venta WHERE id_venta = ?', [id]);
    await connection.query(
      `UPDATE ${TABLE} SET id_usuario = ?, id_cliente = ?, fecha_venta = ?, total = ?, id_metodo_pago = ?, estado = ? WHERE ${PK} = ?`,
      [clients[0].id_usuario, id_cliente, fecha_venta, total, id_metodo_pago, estado, id]
    );
    if (estado !== 'cancelada') await insertItems(connection, id, items);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
