const pool = require('../config/db');

function validationError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function notFoundError(message) {
  const error = new Error(message);
  error.status = 404;
  return error;
}

function conflictError(message) {
  const error = new Error(message);
  error.status = 409;
  return error;
}

function parseId(value, label) {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw validationError(`${label} no válido.`);
  }
  return id;
}

function validateDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw validationError('La fecha no es válida.');
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw validationError('La fecha no es válida.');
  }
  return value;
}

function validateWorkday(value) {
  const date = validateDate(value);
  const weekday = new Date(`${date}T00:00:00.000Z`).getUTCDay();
  if (weekday === 0) {
    throw validationError('El taller no registra asistencia ni trabajos los domingos.');
  }
  return date;
}

function validateTime(value, label) {
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    throw validationError(`${label} no válida.`);
  }
  return value;
}

function validateTimes(start, end, date) {
  const horaInicio = validateTime(start, 'La hora de inicio');
  const horaFin = validateTime(end, 'La hora de fin');
  const weekday = new Date(`${date}T00:00:00.000Z`).getUTCDay();
  const horaCierre = weekday === 6 ? '14:00' : '17:00';
  if (weekday === 0) {
    throw validationError('El taller no registra asistencia los domingos.');
  }
  if (horaInicio < '08:00' || horaFin > horaCierre) {
    throw validationError(
      weekday === 6
        ? 'El horario del sábado debe estar entre las 08:00 y las 14:00.'
        : 'El horario de lunes a viernes debe estar entre las 08:00 y las 17:00.'
    );
  }
  if (horaFin <= horaInicio) {
    throw validationError('La hora de fin debe ser posterior a la hora de inicio.');
  }
  return { horaInicio, horaFin };
}

function validateMonthStart(value) {
  const start = validateDate(value);
  if (!start.endsWith('-01')) {
    throw validationError('El mes debe iniciar el primer día.');
  }
  return start;
}

async function ensureMechanicExists(connection, mechanicId) {
  const [rows] = await connection.query(
    'SELECT id_mecanico FROM mecanicos WHERE id_mecanico = ?',
    [mechanicId]
  );
  if (rows.length === 0) throw notFoundError('El mecánico no existe.');
}

async function getMonthlyActivity(mechanicIdValue, monthStartValue, selectedDateValue) {
  const mechanicId = parseId(mechanicIdValue, 'El identificador del mecánico');
  const monthStart = validateMonthStart(monthStartValue);
  const selectedDate = validateDate(selectedDateValue);
  const monthEnd = new Date(`${monthStart}T00:00:00.000Z`);
  monthEnd.setUTCMonth(monthEnd.getUTCMonth() + 1);
  monthEnd.setUTCDate(0);
  const lastDay = monthEnd.toISOString().slice(0, 10);
  if (selectedDate < monthStart || selectedDate > lastDay) {
    throw validationError('La fecha seleccionada debe pertenecer al mes indicado.');
  }
  await ensureMechanicExists(pool, mechanicId);

  const [asistencias] = await pool.query(
    `SELECT id_asistencia, id_mecanico, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha,
            TIME_FORMAT(hora_inicio, '%H:%i') AS hora_inicio,
            TIME_FORMAT(hora_fin, '%H:%i') AS hora_fin
       FROM asistencias_mecanicos
      WHERE id_mecanico = ? AND fecha BETWEEN ? AND ?
      ORDER BY fecha`,
    [mechanicId, monthStart, lastDay]
  );
  const [trabajos] = await pool.query(
    `SELECT v.id_venta, DATE_FORMAT(v.fecha_venta, '%Y-%m-%d') AS fecha_venta,
            v.estado, dv.id_detalle_venta, dv.id_servicio,
            COALESCE(dv.nombre_servicio, s.nombre) AS nombre_servicio,
            dv.cantidad, dv.precio_unitario, dv.subtotal
       FROM venta v
       JOIN agendamiento a ON a.id_agendamiento = v.id_agendamiento
       JOIN detalle_venta dv ON dv.id_venta = v.id_venta AND dv.id_repuesto IS NULL
       LEFT JOIN servicios s ON s.id_servicio = dv.id_servicio
      WHERE a.id_mecanico = ? AND v.fecha_venta BETWEEN ? AND ? AND v.estado <> 'cancelada'
      ORDER BY v.id_venta, dv.id_detalle_venta`,
    [mechanicId, monthStart, lastDay]
  );
  const dailyTotals = new Map();
  trabajos.forEach((row) => {
    dailyTotals.set(
      row.fecha_venta,
      (dailyTotals.get(row.fecha_venta) || 0) + Number(row.subtotal)
    );
  });
  const [salesRows] = await pool.query(
    `SELECT v.id_venta, DATE_FORMAT(v.fecha_venta, '%Y-%m-%d') AS fecha_venta,
            v.estado, v.total, dv.id_detalle_venta, dv.id_repuesto, dv.id_servicio,
            COALESCE(dv.nombre_servicio, s.nombre, r.nombre) AS nombre_concepto,
            CASE
              WHEN dv.id_repuesto IS NOT NULL THEN 'repuesto'
              WHEN dv.id_servicio IS NOT NULL THEN 'servicio'
              ELSE 'concepto'
            END AS tipo_concepto,
            dv.cantidad, dv.precio_unitario, dv.subtotal
       FROM venta v
       JOIN agendamiento a ON a.id_agendamiento = v.id_agendamiento
       LEFT JOIN detalle_venta dv ON dv.id_venta = v.id_venta
       LEFT JOIN servicios s ON s.id_servicio = dv.id_servicio
       LEFT JOIN repuestos r ON r.id_repuesto = dv.id_repuesto
      WHERE a.id_mecanico = ? AND v.fecha_venta BETWEEN ? AND ?
      ORDER BY v.fecha_venta DESC, v.id_venta DESC, dv.id_detalle_venta`,
    [mechanicId, monthStart, lastDay]
  );
  const salesById = new Map();
  salesRows.forEach((row) => {
    let sale = salesById.get(Number(row.id_venta));
    if (!sale) {
      sale = {
        id_venta: Number(row.id_venta),
        fecha_venta: row.fecha_venta,
        estado: row.estado,
        total: Number(row.total),
        conceptos: [],
      };
      salesById.set(sale.id_venta, sale);
    }
    if (row.id_detalle_venta != null) {
      sale.conceptos.push({
        id_detalle_venta: Number(row.id_detalle_venta),
        id_repuesto: row.id_repuesto == null ? null : Number(row.id_repuesto),
        id_servicio: row.id_servicio == null ? null : Number(row.id_servicio),
        tipo: row.tipo_concepto,
        nombre: row.nombre_concepto || 'Concepto sin nombre',
        cantidad: Number(row.cantidad),
        precio_unitario: Number(row.precio_unitario),
        subtotal: Number(row.subtotal),
      });
    }
  });
  const asistenciasPorFecha = new Set(asistencias.map((asistencia) => asistencia.fecha));
  const ventas = [...salesById.values()]
    .filter((venta) => venta.fecha_venta === selectedDate);
  const roundMoney = (value) => Math.round(value * 100) / 100;
  const totalLiquidacionMes = roundMoney(
    [...dailyTotals.entries()]
      .filter(([date]) => asistenciasPorFecha.has(date))
      .reduce((total, [, amount]) => total + amount, 0)
  );
  const totalLiquidacionDia = asistenciasPorFecha.has(selectedDate)
    ? roundMoney(dailyTotals.get(selectedDate) || 0)
    : 0;
  const diasConVentas = [...new Set(
    [...salesById.values()]
      .filter((sale) => sale.estado !== 'cancelada')
      .map((sale) => sale.fecha_venta)
  )].sort();

  return {
    mes_inicio: monthStart,
    mes_fin: lastDay,
    fecha_seleccionada: selectedDate,
    asistencias,
    ventas,
    dias_con_ventas: diasConVentas,
    total_liquidacion_dia: totalLiquidacionDia,
    total_liquidacion_mes: totalLiquidacionMes,
  };
}

async function getMechanicsWithAttendance(dateValue) {
  const date = validateDate(dateValue);
  const [rows] = await pool.query(
    `SELECT id_mecanico, TIME_FORMAT(hora_inicio, '%H:%i') AS hora_inicio,
            TIME_FORMAT(hora_fin, '%H:%i') AS hora_fin
       FROM asistencias_mecanicos
      WHERE fecha = ?
      ORDER BY id_mecanico`,
    [date]
  );
  return rows.map((row) => ({
    id_mecanico: Number(row.id_mecanico),
    hora_inicio: row.hora_inicio,
    hora_fin: row.hora_fin,
  }));
}

async function createAttendance(mechanicIdValue, data) {
  const mechanicId = parseId(mechanicIdValue, 'El identificador del mecánico');
  const fecha = validateWorkday(data.fecha);
  const { horaInicio, horaFin } = validateTimes(data.hora_inicio, data.hora_fin, fecha);
  await ensureMechanicExists(pool, mechanicId);
  try {
    const [result] = await pool.query(
      `INSERT INTO asistencias_mecanicos (id_mecanico, fecha, hora_inicio, hora_fin)
       VALUES (?, ?, ?, ?)`,
      [mechanicId, fecha, horaInicio, horaFin]
    );
    const [rows] = await pool.query(
      `SELECT id_asistencia, id_mecanico, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha,
              TIME_FORMAT(hora_inicio, '%H:%i') AS hora_inicio,
              TIME_FORMAT(hora_fin, '%H:%i') AS hora_fin
         FROM asistencias_mecanicos WHERE id_asistencia = ?`,
      [result.insertId]
    );
    return rows[0];
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw conflictError('Ya existe una asistencia registrada para ese mecánico y fecha.');
    }
    throw error;
  }
}

async function updateAttendance(mechanicIdValue, attendanceIdValue, data) {
  const mechanicId = parseId(mechanicIdValue, 'El identificador del mecánico');
  const attendanceId = parseId(attendanceIdValue, 'El identificador de asistencia');
  const fecha = validateWorkday(data.fecha);
  const { horaInicio, horaFin } = validateTimes(data.hora_inicio, data.hora_fin, fecha);
  try {
    const [result] = await pool.query(
      `UPDATE asistencias_mecanicos
          SET fecha = ?, hora_inicio = ?, hora_fin = ?
        WHERE id_asistencia = ? AND id_mecanico = ?`,
      [fecha, horaInicio, horaFin, attendanceId, mechanicId]
    );
    if (result.affectedRows === 0) {
      const [rows] = await pool.query(
        'SELECT id_asistencia FROM asistencias_mecanicos WHERE id_asistencia = ? AND id_mecanico = ?',
        [attendanceId, mechanicId]
      );
      if (rows.length === 0) throw notFoundError('La asistencia no existe.');
    }
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw conflictError('Ya existe una asistencia registrada para ese mecánico y fecha.');
    }
    throw error;
  }
  const [rows] = await pool.query(
    `SELECT id_asistencia, id_mecanico, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha,
            TIME_FORMAT(hora_inicio, '%H:%i') AS hora_inicio,
            TIME_FORMAT(hora_fin, '%H:%i') AS hora_fin
       FROM asistencias_mecanicos WHERE id_asistencia = ?`,
    [attendanceId]
  );
  return rows[0];
}

async function removeAttendance(mechanicIdValue, attendanceIdValue) {
  const mechanicId = parseId(mechanicIdValue, 'El identificador del mecánico');
  const attendanceId = parseId(attendanceIdValue, 'El identificador de asistencia');
  const [result] = await pool.query(
    'DELETE FROM asistencias_mecanicos WHERE id_asistencia = ? AND id_mecanico = ?',
    [attendanceId, mechanicId]
  );
  if (result.affectedRows === 0) throw notFoundError('La asistencia no existe.');
}

module.exports = {
  getMonthlyActivity,
  getMechanicsWithAttendance,
  createAttendance,
  updateAttendance,
  removeAttendance,
};
