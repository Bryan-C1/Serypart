const pool = require('../config/db');

// Modelo de la tabla `metodo_pago`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'metodo_pago';
const PK = 'id_metodo_pago';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { nombre } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (nombre) VALUES (?)`,
    [nombre]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { nombre } = data;
  await pool.query(
    `UPDATE ${TABLE} SET nombre = ? WHERE ${PK} = ?`,
    [nombre, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
