const pool = require('../config/db');

// Modelo de la tabla `vehiculos`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'vehiculos';
const PK = 'id_vehiculo';

async function getAll() {
  const [rows] = await pool.query(
    `SELECT v.*, COALESCE(v.id_cliente, cliente_usuario.id_cliente) AS id_cliente_catalogo,
            m.nombre AS marca, md.nombre AS modelo, tv.nombre AS tipo_vehiculo,
            c.nombre AS cliente_nombre, c.apellido AS cliente_apellido
       FROM ${TABLE} v
       LEFT JOIN marca m ON m.id_marca = v.id_marca
       LEFT JOIN modelo md ON md.id_modelo = v.id_modelo
       LEFT JOIN tipo_vehiculo tv ON tv.id_tipo_vehiculo = v.id_tipo_vehiculo
       LEFT JOIN clientes c ON c.id_cliente = v.id_cliente
       LEFT JOIN clientes cliente_usuario ON cliente_usuario.id_usuario = v.id_usuario
      ORDER BY v.${PK} DESC`
  );
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(
    `SELECT v.*, COALESCE(v.id_cliente, cliente_usuario.id_cliente) AS id_cliente_catalogo,
            m.nombre AS marca, md.nombre AS modelo, tv.nombre AS tipo_vehiculo,
            c.nombre AS cliente_nombre, c.apellido AS cliente_apellido
       FROM ${TABLE} v
       LEFT JOIN marca m ON m.id_marca = v.id_marca
       LEFT JOIN modelo md ON md.id_modelo = v.id_modelo
       LEFT JOIN tipo_vehiculo tv ON tv.id_tipo_vehiculo = v.id_tipo_vehiculo
       LEFT JOIN clientes c ON c.id_cliente = v.id_cliente
       LEFT JOIN clientes cliente_usuario ON cliente_usuario.id_usuario = v.id_usuario
      WHERE v.${PK} = ?`,
    [id]
  );
  return rows[0] || null;
}

async function create(data) {
  const { id_cliente, placa, id_marca, id_modelo, anio, color, id_tipo_vehiculo, estado, fecha_registro } = data;
  const [clients] = await pool.query('SELECT id_usuario FROM clientes WHERE id_cliente = ?', [id_cliente]);
  if (clients.length === 0) throw new Error('El cliente seleccionado no existe.');
  const [result] = await pool.query(
    `INSERT INTO ${TABLE} (id_usuario, id_cliente, placa, id_marca, id_modelo, anio, color, id_tipo_vehiculo, estado, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [clients[0].id_usuario, id_cliente, placa, id_marca, id_modelo, anio, color, id_tipo_vehiculo, estado, fecha_registro]
  );
  return getById(result.insertId);
}

async function update(id, data) {
  const { id_cliente, placa, id_marca, id_modelo, anio, color, id_tipo_vehiculo, estado } = data;
  const [clients] = await pool.query('SELECT id_usuario FROM clientes WHERE id_cliente = ?', [id_cliente]);
  if (clients.length === 0) throw new Error('El cliente seleccionado no existe.');
  await pool.query(
    `UPDATE ${TABLE} SET id_usuario = ?, id_cliente = ?, placa = ?, id_marca = ?, id_modelo = ?, anio = ?, color = ?, id_tipo_vehiculo = ?, estado = ? WHERE ${PK} = ?`,
    [clients[0].id_usuario, id_cliente, placa, id_marca, id_modelo, anio, color, id_tipo_vehiculo, estado, id]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
