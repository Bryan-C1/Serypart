const pool = require('../config/db');

// Modelo de la tabla `tipo_vehiculo`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'tipo_vehiculo';
const PK = 'id_tipo_vehiculo';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { nombre, descripcion } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (nombre, descripcion) VALUES (?, ?)`,
    [nombre, descripcion]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { nombre, descripcion } = data;
  await pool.query(
    `UPDATE ${TABLE} SET nombre = ?, descripcion = ? WHERE ${PK} = ?`,
    [nombre, descripcion, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
