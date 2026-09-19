const pool = require('../config/db');

// Modelo de la tabla `proveedor`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'proveedor';
const PK = 'id_proveedor';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { nombre_empresa, nombre_cliente, nit, telefono, email, direccion, estado } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (nombre_empresa, nombre_cliente, nit, telefono, email, direccion, estado) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nombre_empresa, nombre_cliente, nit, telefono, email, direccion, estado]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { nombre_empresa, nombre_cliente, nit, telefono, email, direccion, estado } = data;
  await pool.query(
    `UPDATE ${TABLE} SET nombre_empresa = ?, nombre_cliente = ?, nit = ?, telefono = ?, email = ?, direccion = ?, estado = ? WHERE ${PK} = ?`,
    [nombre_empresa, nombre_cliente, nit, telefono, email, direccion, estado, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
