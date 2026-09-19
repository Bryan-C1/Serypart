const pool = require('../config/db');

// Modelo de la tabla `detalle_agendamiento`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'detalle_agendamiento';
const PK = 'id_detalle_agendamiento';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { id_agendamiento, id_servicio } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (id_agendamiento, id_servicio) VALUES (?, ?)`,
    [id_agendamiento, id_servicio]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { id_agendamiento, id_servicio } = data;
  await pool.query(
    `UPDATE ${TABLE} SET id_agendamiento = ?, id_servicio = ? WHERE ${PK} = ?`,
    [id_agendamiento, id_servicio, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
