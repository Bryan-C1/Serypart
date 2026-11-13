const pool = require('../config/db');

// Modelo de la tabla `servicios`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'servicios';
const PK = 'id_servicio';

function createValidationError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

async function getAll() {
  const [rows] = await pool.query(
    `SELECT s.*, p.codigo AS codigo_padre
       FROM ${TABLE} s
       LEFT JOIN ${TABLE} p ON p.${PK} = s.id_servicio_padre
      ORDER BY s.${PK}`
  );
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(
    `SELECT s.*, p.codigo AS codigo_padre
       FROM ${TABLE} s
       LEFT JOIN ${TABLE} p ON p.${PK} = s.id_servicio_padre
      WHERE s.${PK} = ?`,
    [id]
  );
  return rows[0] || null;
}

async function create(data) {
  const {
    nombre, descripcion, precio, duracion_estimada, estado,
    id_tipo_vehiculo, foto,
  } = data;
  const parentId = data.id_servicio_padre == null || data.id_servicio_padre === ''
    ? null
    : Number(data.id_servicio_padre);
  if (parentId !== null && (!Number.isSafeInteger(parentId) || parentId < 1)) {
    throw createValidationError('El servicio padre no es válido.');
  }

  const connection = await pool.getConnection();
  let lockAcquired = false;
  let serviceId;
  try {
    const [locks] = await connection.query(
      "SELECT GET_LOCK('serypart_servicios_codigo', 10) AS acquired"
    );
    lockAcquired = Number(locks[0]?.acquired) === 1;
    if (!lockAcquired) {
      const error = new Error('No se pudo reservar un código para el servicio. Intenta de nuevo.');
      error.status = 503;
      throw error;
    }

    let parentCode = null;
    if (parentId !== null) {
      const [parents] = await connection.query(
        `SELECT codigo FROM ${TABLE} WHERE ${PK} = ?`,
        [parentId]
      );
      if (parents.length === 0) throw createValidationError('El servicio padre no existe.');
      parentCode = parents[0].codigo;
      if (parentCode.split('.').length >= 3) {
        throw createValidationError('La jerarquía de servicios permite máximo 3 niveles.');
      }
    }

    const [siblings] = await connection.query(
      `SELECT codigo FROM ${TABLE}
        WHERE ${parentId === null ? 'id_servicio_padre IS NULL' : 'id_servicio_padre = ?'}`,
      parentId === null ? [] : [parentId]
    );
    if (parentId !== null && siblings.length >= 3) {
      throw createValidationError('Cada servicio puede tener máximo 3 subservicios.');
    }
    const lastSegment = (code) => Number(code.split('.').pop());
    const nextSegment = Math.max(0, ...siblings.map((service) => lastSegment(service.codigo))) + 1;
    const codigo = parentCode ? `${parentCode}.${nextSegment}` : String(nextSegment);

    const [result] = await connection.query(
      `INSERT INTO ${TABLE}
        (nombre, descripcion, precio, duracion_estimada, estado, id_tipo_vehiculo, foto, id_servicio_padre, codigo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre, descripcion, precio, duracion_estimada, estado,
        id_tipo_vehiculo, foto, parentId, codigo,
      ]
    );
    serviceId = result.insertId;
  } finally {
    try {
      if (lockAcquired) {
        await connection.query("SELECT RELEASE_LOCK('serypart_servicios_codigo')");
      }
    } finally {
      connection.release();
    }
  }

  return getById(serviceId);
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
