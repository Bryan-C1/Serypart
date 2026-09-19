const pool = require('../config/db');

// Modelo de la tabla `roles`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'roles';
const PK = 'id_rol';

function parseRole(row) {
  if (!row) return row;
  return {
    ...row,
    permisos: typeof row.permisos === 'string' ? JSON.parse(row.permisos) : (row.permisos || {}),
  };
}

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows.map(parseRole);
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return parseRole(rows[0] || null);
}

async function create(data) {
  const { nombre, descripcion, permisos, estado } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (nombre, descripcion, permisos, estado) VALUES (?, ?, ?, ?)`,
    [nombre, descripcion, JSON.stringify(permisos || {}), estado || 'activo']
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { nombre, descripcion, permisos, estado } = data;
  await pool.query(
    `UPDATE ${TABLE} SET nombre = ?, descripcion = ?, permisos = ?, estado = ? WHERE ${PK} = ?`,
    [nombre, descripcion, JSON.stringify(permisos || {}), estado || 'activo', id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
