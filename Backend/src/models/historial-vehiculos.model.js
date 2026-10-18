const pool = require('../config/db');

// Modelo de la tabla `historial_vehiculos`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'historial_vehiculos';
const PK = 'id_historial_vehiculos';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { id_vehiculo, descripcion, fecha } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (id_vehiculo, descripcion, fecha) VALUES (?, ?, ?)`,
    [id_vehiculo, descripcion, fecha]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { id_vehiculo, descripcion, fecha } = data;
  await pool.query(
    `UPDATE ${TABLE} SET id_vehiculo = ?, descripcion = ?, fecha = ? WHERE ${PK} = ?`,
    [id_vehiculo, descripcion, fecha, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
