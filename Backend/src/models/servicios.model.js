const pool = require('../config/db');

// Modelo de la tabla `servicios`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'servicios';
const PK = 'id_servicio';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { nombre, descripcion, precio, duracion_estimada, estado, id_tipo_vehiculo, foto } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (nombre, descripcion, precio, duracion_estimada, estado, id_tipo_vehiculo, foto) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nombre, descripcion, precio, duracion_estimada, estado, id_tipo_vehiculo, foto]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { nombre, descripcion, precio, duracion_estimada, estado, id_tipo_vehiculo, foto } = data;
  await pool.query(
    `UPDATE ${TABLE} SET nombre = ?, descripcion = ?, precio = ?, duracion_estimada = ?, estado = ?, id_tipo_vehiculo = ?, foto = ? WHERE ${PK} = ?`,
    [nombre, descripcion, precio, duracion_estimada, estado, id_tipo_vehiculo, foto, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
