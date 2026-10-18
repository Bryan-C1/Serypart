const pool = require('../config/db');

// Modelo de la tabla `agendamiento`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'agendamiento';
const PK = 'id_agendamiento';

function getServiceIds(data) {
  const ids = (Array.isArray(data.servicios) ? data.servicios : [])
    .map((service) => Number(service.id_servicio ?? service.id))
    .filter((id) => Number.isInteger(id) && id > 0);
  if (ids.length > 0) return [...new Set(ids)];
  const legacyId = Number(data.id_servicio);
  return Number.isInteger(legacyId) && legacyId > 0 ? [legacyId] : [];
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
  const serviceIds = getServiceIds(data);
  if (serviceIds.length === 0) throw new Error('La cita debe incluir al menos un servicio.');

  const connection = await pool.getConnection();
  let appointmentId;
  try {
    await connection.beginTransaction();
    const [clients] = await connection.query('SELECT id_usuario FROM clientes WHERE id_cliente = ?', [data.id_cliente]);
    if (clients.length === 0) throw new Error('El cliente seleccionado no existe.');
    const [result] = await connection.query(
      `INSERT INTO ${TABLE} (id_servicio, id_vehiculo, id_usuario, id_cliente, fecha_cita, hora_cita, estado, observaciones, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [serviceIds[0], data.id_vehiculo, clients[0].id_usuario, data.id_cliente, data.fecha_cita, data.hora_cita, data.estado, data.observaciones || '', data.fecha_registro]
    );
    appointmentId = result.insertId;
    for (const idServicio of serviceIds) {
      await connection.query(
        'INSERT INTO detalle_agendamiento (id_agendamiento, id_servicio) VALUES (?, ?)',
        [appointmentId, idServicio]
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  return getById(appointmentId);
}

async function update(id, data) {
  const serviceIds = getServiceIds(data);
  if (serviceIds.length === 0) throw new Error('La cita debe incluir al menos un servicio.');

  const connection = await pool.getConnection();
  try {
    const [clients] = await connection.query('SELECT id_usuario FROM clientes WHERE id_cliente = ?', [data.id_cliente]);
    if (clients.length === 0) throw new Error('El cliente seleccionado no existe.');
    await connection.beginTransaction();
    await connection.query(
      `UPDATE ${TABLE} SET id_servicio = ?, id_vehiculo = ?, id_usuario = ?, id_cliente = ?, fecha_cita = ?, hora_cita = ?, estado = ?, observaciones = ?, fecha_registro = ? WHERE ${PK} = ?`,
      [serviceIds[0], data.id_vehiculo, clients[0].id_usuario, data.id_cliente, data.fecha_cita, data.hora_cita, data.estado, data.observaciones || '', data.fecha_registro, id]
    );
    const [existing] = await connection.query(`SELECT ${PK} FROM ${TABLE} WHERE ${PK} = ?`, [id]);
    if (existing.length === 0) {
      await connection.rollback();
      return null;
    }
    await connection.query('DELETE FROM detalle_agendamiento WHERE id_agendamiento = ?', [id]);
    for (const idServicio of serviceIds) {
      await connection.query(
        'INSERT INTO detalle_agendamiento (id_agendamiento, id_servicio) VALUES (?, ?)',
        [id, idServicio]
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
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
