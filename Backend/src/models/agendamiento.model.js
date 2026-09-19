const pool = require('../config/db');

// Modelo de la tabla `agendamiento`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'agendamiento';
const PK = 'id_agendamiento';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { id_servicio, id_vehiculo, id_usuario, fecha_cita, hora_cita, estado, observaciones, fecha_registro } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (id_servicio, id_vehiculo, id_usuario, fecha_cita, hora_cita, estado, observaciones, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_servicio, id_vehiculo, id_usuario, fecha_cita, hora_cita, estado, observaciones, fecha_registro]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { id_servicio, id_vehiculo, id_usuario, fecha_cita, hora_cita, estado, observaciones, fecha_registro } = data;
  await pool.query(
    `UPDATE ${TABLE} SET id_servicio = ?, id_vehiculo = ?, id_usuario = ?, fecha_cita = ?, hora_cita = ?, estado = ?, observaciones = ?, fecha_registro = ? WHERE ${PK} = ?`,
    [id_servicio, id_vehiculo, id_usuario, fecha_cita, hora_cita, estado, observaciones, fecha_registro, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
