const pool = require('../config/db');

// Modelo de la tabla `detalle_venta`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'detalle_venta';
const PK = 'id_detalle_venta';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { id_venta, id_repuesto, cantidad, precio_unitario, subtotal } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (id_venta, id_repuesto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)`,
    [id_venta, id_repuesto, cantidad, precio_unitario, subtotal]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { id_venta, id_repuesto, cantidad, precio_unitario, subtotal } = data;
  await pool.query(
    `UPDATE ${TABLE} SET id_venta = ?, id_repuesto = ?, cantidad = ?, precio_unitario = ?, subtotal = ? WHERE ${PK} = ?`,
    [id_venta, id_repuesto, cantidad, precio_unitario, subtotal, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
