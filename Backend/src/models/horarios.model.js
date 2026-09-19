const pool = require('../config/db');

// Modelo de la tabla `horario`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'horario';
const PK = 'id_horario';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { id_usuario, fecha, hora_inicio, hora_fin, estado } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (id_usuario, fecha, hora_inicio, hora_fin, estado) VALUES (?, ?, ?, ?, ?)`,
    [id_usuario, fecha, hora_inicio, hora_fin, estado]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { id_usuario, fecha, hora_inicio, hora_fin, estado } = data;
  await pool.query(
    `UPDATE ${TABLE} SET id_usuario = ?, fecha = ?, hora_inicio = ?, hora_fin = ?, estado = ? WHERE ${PK} = ?`,
    [id_usuario, fecha, hora_inicio, hora_fin, estado, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
