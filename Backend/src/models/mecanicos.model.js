const pool = require('../config/db');

const TABLE = 'mecanicos';
const PK = 'id_mecanico';
const MECHANIC_FIELDS = `m.${PK}, m.id_usuario, m.especialidad, m.turno, m.horarios_por_dia,
                         u.nombre, u.apellido, u.tipo_documento, u.numero_documento,
                         u.direccion, u.email, u.telefono, u.estado`;

const HORARIOS_VALIDOS_POR_DIA = {
  Lunes: ['manana', 'mediodia12a1', 'tarde2a3', 'tarde3a4', 'tarde4a5', 'manana8a10', 'manana10a12', 'mediodia', 'tarde'],
  Martes: ['manana', 'mediodia12a1', 'tarde2a3', 'tarde3a4', 'tarde4a5', 'manana8a10', 'manana10a12', 'mediodia', 'tarde'],
  Miércoles: ['manana', 'mediodia12a1', 'tarde2a3', 'tarde3a4', 'tarde4a5', 'manana8a10', 'manana10a12', 'mediodia', 'tarde'],
  Jueves: ['manana', 'mediodia12a1', 'tarde2a3', 'tarde3a4', 'tarde4a5', 'manana8a10', 'manana10a12', 'mediodia', 'tarde'],
  Viernes: ['manana', 'mediodia12a1', 'tarde2a3', 'tarde3a4', 'tarde4a5', 'manana8a10', 'manana10a12', 'mediodia', 'tarde'],
  Sábado: ['manana', 'mediodia12a2', 'manana8a10', 'manana10a12', 'mediodia'],
};
const HORARIOS_MANANA_ANTIGUOS = ['manana8a10', 'manana10a12'];
const HORARIOS_TARDE_ANTIGUOS = ['tarde2a3', 'tarde3a4', 'tarde4a5'];

function validationError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function scheduleConflictError() {
  const error = new Error('El horario seleccionado se cruza con la disponibilidad de otro mecánico.');
  error.status = 409;
  return error;
}

function parseSchedule(value) {
  if (value == null) return {};
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      throw new Error('No se pudo leer un horario de disponibilidad guardado.');
    }
  }
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('No se pudo leer un horario de disponibilidad guardado.');
  }
  return value;
}

function schedulesOverlap(schedule, otherSchedule) {
  return Object.entries(schedule).some(([day, slots]) => {
    const expandSlots = (values) => values.flatMap((slot) => {
      if (slot === 'manana') return HORARIOS_MANANA_ANTIGUOS;
      if (slot === 'mediodia') return [day === 'Sábado' ? 'mediodia12a2' : 'mediodia12a1'];
      if (slot === 'tarde' && day !== 'Sábado') return HORARIOS_TARDE_ANTIGUOS;
      return [slot];
    });
    const currentSlots = expandSlots(slots);
    const otherSlots = expandSlots(Array.isArray(otherSchedule[day]) ? otherSchedule[day] : []);
    return currentSlots.some((slot) => otherSlots.includes(slot));
  });
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
  if (data.horarios_por_dia !== undefined) {
    if (!data.horarios_por_dia || typeof data.horarios_por_dia !== 'object' || Array.isArray(data.horarios_por_dia)) {
      throw validationError('El horario de disponibilidad no es válido.');
    }
    for (const [dia, horarios] of Object.entries(data.horarios_por_dia)) {
      if (!HORARIOS_VALIDOS_POR_DIA[dia] || !Array.isArray(horarios) ||
          horarios.some((horario) => !HORARIOS_VALIDOS_POR_DIA[dia].includes(horario))) {
        throw validationError('El horario de disponibilidad contiene días u horarios no válidos.');
      }
    }
  }
}

async function validateScheduleAvailability(connection, schedule, currentMechanicId = null) {
  await ensureScheduleColumn(connection);
  const [mechanics] = await connection.query(
    `SELECT m.${PK} AS id_mecanico, m.horarios_por_dia
       FROM ${TABLE} m
       JOIN usuarios u ON u.id_usuario = m.id_usuario
       WHERE COALESCE(u.estado, '') <> 'anulado'
      ORDER BY m.${PK}
      FOR UPDATE`
  );

  const conflict = mechanics.some((mechanic) =>
    Number(mechanic.id_mecanico) !== Number(currentMechanicId) &&
    schedulesOverlap(schedule, parseSchedule(mechanic.horarios_por_dia))
  );
  if (conflict) throw scheduleConflictError();
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

async function ensureScheduleColumn(connection = pool) {
  const [columns] = await connection.query("SHOW COLUMNS FROM mecanicos LIKE 'horarios_por_dia'");
  if (columns.length !== 0) return;

  try {
    await connection.query('ALTER TABLE mecanicos ADD COLUMN horarios_por_dia JSON NULL');
  } catch (error) {
    if (error.code !== 'ER_DUP_FIELDNAME') throw error;
  }
}

async function getAll() {
  await ensureScheduleColumn();
  const [rows] = await pool.query(
    `SELECT ${MECHANIC_FIELDS}
       FROM ${TABLE} m
       JOIN usuarios u ON u.id_usuario = m.id_usuario
      ORDER BY u.nombre, u.apellido`
  );
  return rows;
}

async function getById(id) {
  await ensureScheduleColumn();
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
    await ensureScheduleColumn(connection);
    await connection.beginTransaction();
    await validateScheduleAvailability(connection, data.horarios_por_dia || {});
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
      `INSERT INTO ${TABLE} (${PK}, id_usuario, especialidad, turno, horarios_por_dia) VALUES (?, ?, ?, ?, ?)`,
      [mechanicId, userId, data.especialidad || 'General', data.turno || 'Completo', JSON.stringify(data.horarios_por_dia || {})]
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
    await ensureScheduleColumn(connection);
    await connection.beginTransaction();
    if (data.horarios_por_dia !== undefined) {
      await validateScheduleAvailability(connection, data.horarios_por_dia, id);
    }
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
    const mechanicFields = ['especialidad = ?', 'turno = ?'];
    const mechanicValues = [data.especialidad || 'General', data.turno || 'Completo'];
    if (data.horarios_por_dia !== undefined) {
      mechanicFields.push('horarios_por_dia = ?');
      mechanicValues.push(JSON.stringify(data.horarios_por_dia));
    }
    await connection.query(
      `UPDATE ${TABLE} SET ${mechanicFields.join(', ')} WHERE ${PK} = ?`,
      [...mechanicValues, id]
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
