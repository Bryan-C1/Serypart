const pool = require('../config/db');

// Modelo de la tabla `repuesto_foto`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'repuesto_foto';
const PK = 'id_repuesto_foto';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { id_repuesto, foto } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (id_repuesto, foto) VALUES (?, ?)`,
    [id_repuesto, foto]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { id_repuesto, foto } = data;
  await pool.query(
    `UPDATE ${TABLE} SET id_repuesto = ?, foto = ? WHERE ${PK} = ?`,
    [id_repuesto, foto, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
