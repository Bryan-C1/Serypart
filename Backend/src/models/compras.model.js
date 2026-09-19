const pool = require('../config/db');

// Modelo de la tabla `compra`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'compra';
const PK = 'id_compra';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { id_proveedor, fecha_compra, total, estado } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (id_proveedor, fecha_compra, total, estado) VALUES (?, ?, ?, ?)`,
    [id_proveedor, fecha_compra, total, estado]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { id_proveedor, fecha_compra, total, estado } = data;
  await pool.query(
    `UPDATE ${TABLE} SET id_proveedor = ?, fecha_compra = ?, total = ?, estado = ? WHERE ${PK} = ?`,
    [id_proveedor, fecha_compra, total, estado, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
