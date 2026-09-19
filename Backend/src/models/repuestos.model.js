const pool = require('../config/db');

// Modelo de la tabla `repuestos`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'repuestos';
const PK = 'id_repuesto';

async function getAll() {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE}`);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { nombre, descripcion, id_marca_repuesto, precio_unitario, stock, stock_minimo, estado } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (nombre, descripcion, id_marca_repuesto, precio_unitario, stock, stock_minimo, estado) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nombre, descripcion, id_marca_repuesto, precio_unitario, stock, stock_minimo, estado]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { nombre, descripcion, id_marca_repuesto, precio_unitario, stock, stock_minimo, estado } = data;
  await pool.query(
    `UPDATE ${TABLE} SET nombre = ?, descripcion = ?, id_marca_repuesto = ?, precio_unitario = ?, stock = ?, stock_minimo = ?, estado = ? WHERE ${PK} = ?`,
    [nombre, descripcion, id_marca_repuesto, precio_unitario, stock, stock_minimo, estado, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
