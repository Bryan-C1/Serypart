const pool = require('../config/db');

// Modelo de la tabla `modelo`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'modelo';
const PK = 'id_modelo';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { nombre, id_marca } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (nombre, id_marca) VALUES (?, ?)`,
    [nombre, id_marca]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { nombre, id_marca } = data;
  await pool.query(
    `UPDATE ${TABLE} SET nombre = ?, id_marca = ? WHERE ${PK} = ?`,
    [nombre, id_marca, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
