const pool = require('../config/db');

// Modelo de la tabla `orden_servicio`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'orden_servicio';
const PK = 'id_orden_servicio';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { id_agendamiento, fecha_inicio, fecha_fin, estado, total, observacion } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (id_agendamiento, fecha_inicio, fecha_fin, estado, total, observacion) VALUES (?, ?, ?, ?, ?, ?)`,
    [id_agendamiento, fecha_inicio, fecha_fin, estado, total, observacion]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { id_agendamiento, fecha_inicio, fecha_fin, estado, total, observacion } = data;
  await pool.query(
    `UPDATE ${TABLE} SET id_agendamiento = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?, total = ?, observacion = ? WHERE ${PK} = ?`,
    [id_agendamiento, fecha_inicio, fecha_fin, estado, total, observacion, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
