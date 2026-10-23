const pool = require('../config/db');

const TABLE = 'mecanicos';
const PK = 'id_mecanico';
const MECHANIC_FIELDS = `m.${PK}, m.id_usuario, m.especialidad, m.turno,
                         u.nombre, u.apellido, u.tipo_documento, u.numero_documento,
                         u.direccion, u.email, u.telefono, u.estado`;

function validationError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function validate(data) {
  const nombre = String(data.nombre || '').trim();
  const email = String(data.email || '').trim();
  if (!nombre) throw validationError('El nombre del mecánico es obligatorio.');
  if (nombre.length > 30 || String(data.apellido || '').length > 30) {
    throw validationError('El nombre y apellido deben tener máximo 30 caracteres.');
  }
  if (email.length > 50 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw validationError('Ingresa un correo electrónico válido de máximo 50 caracteres.');
  }
  if (String(data.telefono || '').length > 20 || String(data.direccion || '').length > 255) {
    throw validationError('El teléfono o la dirección exceden el máximo permitido.');
  }
  const estados = ['activo', 'inactivo', 'vacaciones', 'anulado'];
  if (data.estado && !estados.includes(data.estado)) {
    throw validationError('El estado del mecánico no es válido.');
  }
  if (data.turno && !['Mañana', 'Tarde', 'Completo'].includes(data.turno)) {
    throw validationError('El turno del mecánico no es válido.');
  }
}

function normalizeDocument(value) {
  if (value == null || value === '') return null;
  const document = Number(value);
  if (!Number.isSafeInteger(document) || document < 0 || document > 2147483647) {
    throw validationError('El número de documento no es válido.');
  }
  return document;
}

function handleDuplicate(error) {
  if (error.code !== 'ER_DUP_ENTRY') throw error;
  const conflict = new Error('Ya existe un usuario con ese correo o identificador.');
  conflict.status = 409;
  throw conflict;
}

async function getAll() {
  const [rows] = await pool.query(
    `SELECT ${MECHANIC_FIELDS}
       FROM ${TABLE} m
       JOIN usuarios u ON u.id_usuario = m.id_usuario
      ORDER BY u.nombre, u.apellido`
  );
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(
    `SELECT ${MECHANIC_FIELDS}
       FROM ${TABLE} m
       JOIN usuarios u ON u.id_usuario = m.id_usuario
      WHERE m.${PK} = ?`,
    [id]
  );
  return rows[0] || null;
}

async function getMechanicRole(connection) {
  const [roles] = await connection.query(
    `SELECT id_rol
       FROM roles
      WHERE LOWER(TRIM(nombre)) IN ('mecanico', 'mecanicos')
        AND (estado IS NULL OR LOWER(estado) = 'activo')
      ORDER BY CASE WHEN LOWER(TRIM(nombre)) = 'mecanico' THEN 0 ELSE 1 END
      LIMIT 1`
  );
  if (roles.length === 0) {
    const error = new Error('No está configurado un rol activo de Mecánico en el módulo de roles.');
    error.status = 409;
    throw error;
  }
  return roles[0].id_rol;
}

async function create(data) {
  validate(data);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const idRol = await getMechanicRole(connection);
    const [userResult] = await connection.query(
      `INSERT INTO usuarios
        (nombre, apellido, numero_documento, tipo_documento, fecha_registro, email,
         contraseña, telefono, estado, id_rol, direccion)
       VALUES (?, ?, ?, ?, CURDATE(), ?, NULL, ?, 'activo', ?, ?)`,
      [
        String(data.nombre).trim(), data.apellido || '', normalizeDocument(data.numero_documento),
        data.tipo_documento || 'V', String(data.email).trim(),
        data.telefono || '', idRol, data.direccion || '',
      ]
    );
    const userId = userResult.insertId;
    const [mechanicIds] = await connection.query(
      `SELECT COALESCE(MAX(${PK}), 0) + 1 AS next_id FROM ${TABLE}`
    );
    const mechanicId = mechanicIds[0].next_id;
    await connection.query(
      `INSERT INTO ${TABLE} (${PK}, id_usuario, especialidad, turno) VALUES (?, ?, ?, ?)`,
      [mechanicId, userId, data.especialidad || 'General', data.turno || 'Completo']
    );
    await connection.commit();
    return getById(mechanicId);
  } catch (error) {
    await connection.rollback();
    handleDuplicate(error);
  } finally {
    connection.release();
  }
}

async function update(id, data) {
  validate(data);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [mechanics] = await connection.query(
      `SELECT id_usuario FROM ${TABLE} WHERE ${PK} = ? FOR UPDATE`,
      [id]
    );
    if (mechanics.length === 0) {
      await connection.rollback();
      return null;
    }

    const userId = mechanics[0].id_usuario;
    const userFields = [
      'nombre = ?', 'apellido = ?', 'numero_documento = ?', 'tipo_documento = ?',
      'email = ?', 'telefono = ?', 'estado = ?', 'direccion = ?',
    ];
    const userValues = [
      String(data.nombre).trim(), data.apellido || '', normalizeDocument(data.numero_documento),
      data.tipo_documento || 'V', String(data.email).trim(), data.telefono || '',
      data.estado || 'activo', data.direccion || '',
    ];
    await connection.query(
      `UPDATE usuarios SET ${userFields.join(', ')} WHERE id_usuario = ?`,
      [...userValues, userId]
    );
    await connection.query(
      `UPDATE ${TABLE} SET especialidad = ?, turno = ? WHERE ${PK} = ?`,
      [data.especialidad || 'General', data.turno || 'Completo', id]
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    handleDuplicate(error);
  } finally {
    connection.release();
  }
  return getById(id);
}

async function remove(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [mechanics] = await connection.query(
      `SELECT id_usuario FROM ${TABLE} WHERE ${PK} = ? FOR UPDATE`,
      [id]
    );
    if (mechanics.length === 0) {
      await connection.rollback();
      return false;
    }
    const userId = mechanics[0].id_usuario;
    const [appointments] = await connection.query(
      'SELECT id_agendamiento FROM agendamiento WHERE id_mecanico = ? LIMIT 1',
      [id]
    );
    if (appointments.length > 0) {
      const error = new Error('No se puede eliminar un mecánico que está asignado a una cita.');
      error.status = 409;
      throw error;
    }
    await connection.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
    await connection.query("UPDATE usuarios SET estado = 'inactivo' WHERE id_usuario = ?", [userId]);
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { getAll, getById, create, update, remove };
