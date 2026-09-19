const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Modelo de la tabla `usuarios`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'usuarios';
const PK = 'id_usuario';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getClientes() {
  const [rows] = await pool.query(
    `SELECT u.*
       FROM ${TABLE} u
      WHERE EXISTS (
        SELECT 1
          FROM venta v
         WHERE v.id_usuario = u.${PK}
      )`
  );
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { nombre, apellido, numero_documento, tipo_documento, fecha_registro, email, contraseña, telefono, estado, id_rol } = data;
  const contraseñaHash = contraseña ? await bcrypt.hash(contraseña, 10) : null;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (nombre, apellido, numero_documento, tipo_documento, fecha_registro, email, contraseña, telefono, estado, id_rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, apellido, numero_documento, tipo_documento, fecha_registro, email, contraseñaHash, telefono, estado, id_rol]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const fields = [
    'nombre',
    'apellido',
    'numero_documento',
    'tipo_documento',
    'fecha_registro',
    'email',
    'telefono',
    'estado',
    'id_rol',
  ];
  const assignments = [];
  const values = [];

  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      assignments.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  if (Object.prototype.hasOwnProperty.call(data, 'contraseña')) {
    assignments.push('contraseña = ?');
    values.push(data.contraseña ? await bcrypt.hash(data.contraseña, 10) : null);
  }

  if (assignments.length === 0) return getById(id);

  await pool.query(
    `UPDATE ${TABLE} SET ${assignments.join(', ')} WHERE ${PK} = ?`,
    [...values, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getClientes, getById, create, update, remove };
