const pool = require('../config/db');
const { addVehicleHistory } = require('../services/vehicle-history.service');

// Modelo de la tabla `agendamiento`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'agendamiento';
const PK = 'id_agendamiento';

async function ensureClientRelationColumns(connection = pool) {
  const [columns] = await connection.query("SHOW COLUMNS FROM agendamiento LIKE 'id_cliente'");
  if (columns.length === 0) {
    await connection.query('ALTER TABLE agendamiento ADD COLUMN id_cliente INT NULL');
  }
}

function getServiceIds(data) {
  const ids = (Array.isArray(data.servicios) ? data.servicios : [])
    .map((service) => Number(service.id_servicio ?? service.id))
    .filter((id) => Number.isInteger(id) && id > 0);
  if (ids.length > 0) return [...new Set(ids)];
  const legacyId = Number(data.id_servicio);
  return Number.isInteger(legacyId) && legacyId > 0 ? [legacyId] : [];
}

function getMechanicId(data, required = true) {
  if ((data.id_mecanico == null || data.id_mecanico === '') && !required) return null;
  const id = Number(data.id_mecanico);
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error('La cita debe tener un mecánico asignado.');
    error.status = 400;
    throw error;
  }
  return id;
}

function handleDuplicateMechanic(error) {
  if (error.code !== 'ER_DUP_ENTRY') throw error;
  const conflict = new Error('El mecánico seleccionado ya tiene una cita pendiente de completar.');
  conflict.status = 409;
  throw conflict;
}

async function validateMechanic(connection, mechanicId) {
  const [rows] = await connection.query(
    'SELECT id_mecanico FROM mecanicos WHERE id_mecanico = ?',
    [mechanicId]
  );
  if (rows.length === 0) {
    const error = new Error('El mecánico seleccionado no existe.');
    error.status = 400;
    throw error;
  }
}

async function validateMechanicAttendance(connection, mechanicId, date, time) {
  const [rows] = await connection.query(
    `SELECT TIME_FORMAT(hora_inicio, '%H:%i') AS hora_inicio,
            TIME_FORMAT(hora_fin, '%H:%i') AS hora_fin
       FROM asistencias_mecanicos
      WHERE id_mecanico = ? AND fecha = ?`,
    [mechanicId, date]
  );
  if (rows.length === 0) {
    const error = new Error('El mecánico no tiene asistencia registrada para la fecha seleccionada.');
    error.status = 409;
    throw error;
  }
  const appointmentTime = String(time || '').slice(0, 5);
  if (appointmentTime < rows[0].hora_inicio || appointmentTime >= rows[0].hora_fin) {
    const error = new Error(
      `La hora de la cita debe estar dentro de la asistencia del mecánico (${rows[0].hora_inicio}–${rows[0].hora_fin}).`
    );
    error.status = 409;
    throw error;
  }
}

async function addAppointmentHistory(connection, appointmentId, vehicleId, date) {
  const [services] = await connection.query(
    `SELECT GROUP_CONCAT(s.nombre ORDER BY da.id_detalle_agendamiento SEPARATOR ', ') AS nombres
       FROM detalle_agendamiento da
       LEFT JOIN servicios s ON s.id_servicio = da.id_servicio
      WHERE da.id_agendamiento = ?`,
    [appointmentId]
  );
  const serviceNames = services[0]?.nombres || 'Servicio completado';
  const prefix = `Cita #${appointmentId}: `;
  await addVehicleHistory(
    connection,
    vehicleId,
    `Cita #${appointmentId}:`,
    `${prefix}${serviceNames}`,
    date
  );
}

async function getServices(ids) {
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => '?').join(', ');
  const [rows] = await pool.query(
    `SELECT da.id_agendamiento, da.id_servicio, s.nombre, s.descripcion, s.precio
       FROM detalle_agendamiento da
       LEFT JOIN servicios s ON s.id_servicio = da.id_servicio
      WHERE da.id_agendamiento IN (${placeholders})
      ORDER BY da.id_detalle_agendamiento`,
    ids
  );
  return rows;
}

async function withServices(rows) {
  const services = await getServices(rows.map((row) => row[PK]));
  const servicesByAppointment = new Map();
  services.forEach((service) => {
    const appointmentServices = servicesByAppointment.get(service.id_agendamiento) || [];
    appointmentServices.push({
      id: service.id_servicio,
      id_servicio: service.id_servicio,
      nombre: service.nombre,
      descripcion: service.descripcion,
      precio: service.precio,
    });
    servicesByAppointment.set(service.id_agendamiento, appointmentServices);
  });

  return rows.map((row) => {
    const appointmentServices = servicesByAppointment.get(row[PK]) || [];
    if (appointmentServices.length === 0 && row.id_servicio) {
      appointmentServices.push({
        id: row.id_servicio,
        id_servicio: row.id_servicio,
        nombre: row.servicio_nombre || null,
      });
    }
    return {
      ...row,
      id: row[PK],
      nombre_cliente: [row.cliente_nombre, row.cliente_apellido].filter(Boolean).join(' '),
      nombre_vehiculo: row.placa || '',
      servicios: appointmentServices,
    };
  });
}

async function getAll() {
  await ensureClientRelationColumns();
  const [rows] = await pool.query(
    `SELECT a.*, s.nombre AS servicio_nombre, c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido, v.placa
       FROM ${TABLE} a
       LEFT JOIN servicios s ON s.id_servicio = a.id_servicio
       LEFT JOIN clientes c ON c.id_cliente = a.id_cliente
       LEFT JOIN vehiculos v ON v.id_vehiculo = a.id_vehiculo
      ORDER BY a.fecha_cita, a.hora_cita`
  );
  return withServices(rows);
}

async function getById(id) {
  await ensureClientRelationColumns();
  const [rows] = await pool.query(
    `SELECT a.*, s.nombre AS servicio_nombre, c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido, v.placa
       FROM ${TABLE} a
       LEFT JOIN servicios s ON s.id_servicio = a.id_servicio
       LEFT JOIN clientes c ON c.id_cliente = a.id_cliente
       LEFT JOIN vehiculos v ON v.id_vehiculo = a.id_vehiculo
      WHERE a.${PK} = ?`,
    [id]
  );
  return (await withServices(rows))[0] || null;
}

async function create(data) {
  await ensureClientRelationColumns();
  const serviceIds = getServiceIds(data);
  const mechanicId = getMechanicId(data);
  if (serviceIds.length === 0) throw new Error('La cita debe incluir al menos un servicio.');

  const connection = await pool.getConnection();
  let appointmentId;
  try {
    await connection.beginTransaction();
    const [clients] = await connection.query('SELECT id_usuario FROM clientes WHERE id_cliente = ?', [data.id_cliente]);
    if (clients.length === 0) throw new Error('El cliente seleccionado no existe.');
    await validateMechanic(connection, mechanicId);
    if (data.estado !== 'cancelada') {
      await validateMechanicAttendance(connection, mechanicId, data.fecha_cita, data.hora_cita);
    }
    const [result] = await connection.query(
      `INSERT INTO ${TABLE} (id_servicio, id_vehiculo, id_usuario, id_cliente, id_mecanico, fecha_cita, hora_cita, estado, observaciones, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [serviceIds[0], data.id_vehiculo, clients[0].id_usuario, data.id_cliente, mechanicId, data.fecha_cita, data.hora_cita, data.estado, data.observaciones || '', data.fecha_registro]
    );
    appointmentId = result.insertId;
    for (const idServicio of serviceIds) {
      await connection.query(
        'INSERT INTO detalle_agendamiento (id_agendamiento, id_servicio) VALUES (?, ?)',
        [appointmentId, idServicio]
      );
    }
    if (data.estado === 'completada') {
      await addAppointmentHistory(connection, appointmentId, data.id_vehiculo, data.fecha_cita);
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    handleDuplicateMechanic(error);
  } finally {
    connection.release();
  }
  return getById(appointmentId);
}

async function update(id, data) {
  await ensureClientRelationColumns();
  const serviceIds = getServiceIds(data);
  const mechanicId = getMechanicId(data, false);
  if (serviceIds.length === 0) throw new Error('La cita debe incluir al menos un servicio.');

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [existingAppointments] = await connection.query(
      `SELECT estado, id_mecanico, DATE_FORMAT(fecha_cita, '%Y-%m-%d') AS fecha_cita,
              TIME_FORMAT(hora_cita, '%H:%i') AS hora_cita
         FROM ${TABLE} WHERE ${PK} = ? FOR UPDATE`,
      [id]
    );
    if (existingAppointments.length === 0) {
      await connection.rollback();
      return null;
    }
    const [clients] = await connection.query('SELECT id_usuario FROM clientes WHERE id_cliente = ?', [data.id_cliente]);
    if (clients.length === 0) throw new Error('El cliente seleccionado no existe.');
    const assignedMechanicId = mechanicId ?? existingAppointments[0].id_mecanico;
    if (mechanicId !== null) await validateMechanic(connection, mechanicId);
    const scheduleChanged = Number(assignedMechanicId) !== Number(existingAppointments[0].id_mecanico)
      || data.fecha_cita !== existingAppointments[0].fecha_cita
      || String(data.hora_cita || '').slice(0, 5) !== existingAppointments[0].hora_cita;
    if (data.estado !== 'cancelada' && scheduleChanged) {
      await validateMechanicAttendance(connection, assignedMechanicId, data.fecha_cita, data.hora_cita);
    }
    await connection.query(
      `UPDATE ${TABLE} SET id_servicio = ?, id_vehiculo = ?, id_usuario = ?, id_cliente = ?, id_mecanico = COALESCE(?, id_mecanico), fecha_cita = ?, hora_cita = ?, estado = ?, observaciones = ?, fecha_registro = ? WHERE ${PK} = ?`,
      [serviceIds[0], data.id_vehiculo, clients[0].id_usuario, data.id_cliente, mechanicId, data.fecha_cita, data.hora_cita, data.estado, data.observaciones || '', data.fecha_registro, id]
    );
    await connection.query('DELETE FROM detalle_agendamiento WHERE id_agendamiento = ?', [id]);
    for (const idServicio of serviceIds) {
      await connection.query(
        'INSERT INTO detalle_agendamiento (id_agendamiento, id_servicio) VALUES (?, ?)',
        [id, idServicio]
      );
    }
    if (data.estado === 'completada' && existingAppointments[0].estado !== 'completada') {
      await addAppointmentHistory(connection, id, data.id_vehiculo, data.fecha_cita);
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    handleDuplicateMechanic(error);
  } finally {
    connection.release();
  }
  return getById(id);
}

async function remove(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query('DELETE FROM detalle_agendamiento WHERE id_agendamiento = ?', [id]);
    const [result] = await connection.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { getAll, getById, create, update, remove };
