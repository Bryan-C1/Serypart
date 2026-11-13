const pool = require('../config/db');
const { addVehicleHistory } = require('../services/vehicle-history.service');

// Modelo de la tabla `venta`: todas las queries están aquí, explícitas, sin abstracción genérica.

const TABLE = 'venta';
const PK = 'id_venta';

async function ensureClientRelationColumns(connection = pool) {
  const [columns] = await connection.query("SHOW COLUMNS FROM venta LIKE 'id_cliente'");
  if (columns.length === 0) {
    await connection.query('ALTER TABLE venta ADD COLUMN id_cliente INT NULL');
  }
}

async function ensureAppointmentRelationColumn(connection = pool) {
  const [columns] = await connection.query("SHOW COLUMNS FROM venta LIKE 'id_agendamiento'");
  if (columns.length === 0) {
    await connection.query('ALTER TABLE venta ADD COLUMN id_agendamiento INT NULL');
  }

  const [existingIndex] = await connection.query(
    "SHOW INDEX FROM venta WHERE Key_name = 'idx_venta_id_agendamiento'"
  );
  if (existingIndex.length === 0) {
    await connection.query('ALTER TABLE venta ADD KEY idx_venta_id_agendamiento (id_agendamiento)');
  }
}

async function ensureDetailVentaServiceColumns(connection = pool) {
  const [serviceColumn] = await connection.query("SHOW COLUMNS FROM detalle_venta LIKE 'id_servicio'");
  if (serviceColumn.length === 0) {
    await connection.query('ALTER TABLE detalle_venta ADD COLUMN id_servicio INT NULL AFTER id_repuesto');
  }

  const [serviceNameColumn] = await connection.query("SHOW COLUMNS FROM detalle_venta LIKE 'nombre_servicio'");
  if (serviceNameColumn.length === 0) {
    await connection.query('ALTER TABLE detalle_venta ADD COLUMN nombre_servicio VARCHAR(150) NULL AFTER id_servicio');
  }

  const [existingIndex] = await connection.query(
    "SHOW INDEX FROM detalle_venta WHERE Key_name = 'idx_detalle_venta_servicio'"
  );
  if (existingIndex.length === 0) {
    await connection.query('ALTER TABLE detalle_venta ADD KEY idx_detalle_venta_servicio (id_servicio)');
  }
}

function getRepuestoItems(data) {
  const items = Array.isArray(data.items) ? data.items : [];
  return items
    .filter((item) => item.id_repuesto !== undefined && item.id_repuesto !== null)
    .map((item) => {
      const idRepuesto = Number(item.id_repuesto);
      const cantidad = Number(item.cantidad);
      const precioUnitario = Number(item.precio_unitario);
      if (!Number.isInteger(idRepuesto) || idRepuesto < 1
        || !Number.isInteger(cantidad) || cantidad < 1
        || !Number.isFinite(precioUnitario) || precioUnitario < 0) {
        throw new Error('Los repuestos de la venta tienen datos inválidos.');
      }
      return { id_repuesto: idRepuesto, cantidad, precio_unitario: precioUnitario };
    });
}

function getServiceItems(data) {
  const items = Array.isArray(data.items) ? data.items : [];
  const services = items
    .filter((item) => item.id_servicio !== undefined && item.id_servicio !== null)
    .map((item) => {
      const idServicio = Number(item.id_servicio);
      const cantidad = Number(item.cantidad);
      if (!Number.isInteger(idServicio) || idServicio < 1
        || !Number.isInteger(cantidad) || cantidad < 1) {
        throw new Error('Los servicios de la venta tienen datos inválidos.');
      }
      return { id_servicio: idServicio, cantidad };
    });
  if (new Set(services.map((item) => item.id_servicio)).size !== services.length) {
    throw new Error('No se puede incluir dos veces el mismo servicio en una venta.');
  }
  return services;
}

async function getAppointmentId(connection, clientId, value) {
  if (value === undefined || value === null || value === '') return null;
  const appointmentId = Number(value);
  if (!Number.isSafeInteger(appointmentId) || appointmentId < 1) {
    const error = new Error('La cita asociada a la venta no es válida.');
    error.status = 400;
    throw error;
  }
  const [appointments] = await connection.query(
    `SELECT id_agendamiento
       FROM agendamiento
      WHERE id_agendamiento = ? AND id_cliente = ? AND id_mecanico IS NOT NULL`,
    [appointmentId, clientId]
  );
  if (appointments.length === 0) {
    const error = new Error('La cita debe pertenecer al cliente y tener un mecánico asignado.');
    error.status = 400;
    throw error;
  }
  return appointmentId;
}

async function insertServiceItems(connection, saleId, items, previousItems = []) {
  for (const item of items) {
    const previous = previousItems.find((saved) => Number(saved.id_servicio) === item.id_servicio);
    let service;
    if (previous) {
      service = {
        nombre: previous.nombre_servicio,
        precio: Number(previous.precio_unitario),
      };
    } else {
      const [services] = await connection.query(
        'SELECT nombre, precio FROM servicios WHERE id_servicio = ?',
        [item.id_servicio]
      );
      if (services.length === 0) {
        const error = new Error(`El servicio ${item.id_servicio} no existe.`);
        error.status = 400;
        throw error;
      }
      service = services[0];
    }

    await connection.query(
      `INSERT INTO detalle_venta
        (id_venta, id_repuesto, id_servicio, nombre_servicio, cantidad, precio_unitario, subtotal)
       VALUES (?, NULL, ?, ?, ?, ?, ?)`,
      [
        saleId, item.id_servicio, service.nombre, item.cantidad,
        service.precio, Number(service.precio) * item.cantidad,
      ]
    );
  }
}

function mapSaleRows(rows) {
  const sales = new Map();
  rows.forEach((row) => {
    let sale = sales.get(row.id_venta);
    if (!sale) {
      sale = {
        id_venta: row.id_venta,
        id_agendamiento: row.id_agendamiento,
        id_cliente: row.id_cliente,
        id_usuario: row.id_usuario,
        fecha_venta: row.fecha_venta,
        total: row.total,
        id_metodo_pago: row.id_metodo_pago,
        estado: row.estado,
        usuario_nombre: row.cliente_nombre,
        usuario_apellido: row.cliente_apellido,
        mecanico_nombre: row.mecanico_nombre,
        mecanico_apellido: row.mecanico_apellido,
        nombre_mecanico: [row.mecanico_nombre, row.mecanico_apellido].filter(Boolean).join(' ') || null,
        metodo_pago_nombre: row.metodo_pago_nombre,
        items: [],
      };
      sales.set(row.id_venta, sale);
    }
    if (row.id_detalle_venta != null) {
      sale.items.push({
        id_detalle_venta: row.id_detalle_venta,
        id_venta: row.id_venta,
        id_repuesto: row.id_repuesto == null ? null : Number(row.id_repuesto),
        id_servicio: row.id_repuesto == null && row.id_servicio != null
          ? Number(row.id_servicio)
          : null,
        nombre: row.id_repuesto == null
          ? row.nombre_servicio || row.nombre_servicio_catalogo || ''
          : row.nombre_repuesto || '',
        cantidad: row.cantidad,
        precio_unitario: row.precio_unitario,
        subtotal: row.subtotal,
        tipo: row.id_repuesto == null ? 'servicio' : 'repuesto',
      });
    }
  });
  return [...sales.values()];
}

async function getVenta(connection, id) {
  const [rows] = await connection.query(
    `SELECT v.*, c.nombre AS cliente_nombre, c.apellido AS cliente_apellido,
            um.nombre AS mecanico_nombre, um.apellido AS mecanico_apellido,
            dv.id_detalle_venta, dv.id_repuesto, dv.id_servicio, dv.nombre_servicio,
            dv.cantidad, dv.precio_unitario, dv.subtotal,
            r.nombre AS nombre_repuesto, s.nombre AS nombre_servicio_catalogo,
            mp.nombre AS metodo_pago_nombre
       FROM ${TABLE} v
       LEFT JOIN clientes c ON c.id_cliente = v.id_cliente
       LEFT JOIN agendamiento a ON a.id_agendamiento = v.id_agendamiento
       LEFT JOIN mecanicos m ON m.id_mecanico = a.id_mecanico
       LEFT JOIN usuarios um ON um.id_usuario = m.id_usuario
       LEFT JOIN detalle_venta dv ON dv.id_venta = v.${PK}
       LEFT JOIN repuestos r ON r.id_repuesto = dv.id_repuesto
       LEFT JOIN servicios s ON s.id_servicio = dv.id_servicio
       LEFT JOIN metodo_pago mp ON mp.id_metodo_pago = v.id_metodo_pago
      WHERE v.${PK} = ?
      ORDER BY dv.id_detalle_venta`,
    [id]
  );
  return mapSaleRows(rows)[0] || null;
}

async function insertItems(connection, saleId, items) {
  for (const item of items) {
    const [result] = await connection.query(
      'UPDATE repuestos SET stock = stock - ? WHERE id_repuesto = ? AND stock >= ?',
      [item.cantidad, item.id_repuesto, item.cantidad]
    );
    if (result.affectedRows === 0) {
      throw new Error(`No hay stock suficiente para el repuesto ${item.id_repuesto}.`);
    }
    await connection.query(
      'INSERT INTO detalle_venta (id_venta, id_repuesto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
      [saleId, item.id_repuesto, item.cantidad, item.precio_unitario, item.cantidad * item.precio_unitario]
    );
  }
}

async function addSaleHistory(connection, saleId, clientId, date) {
  const [vehicles] = await connection.query(
    `SELECT a.id_vehiculo, MIN(a.id_agendamiento) AS id_agendamiento
       FROM agendamiento a
      WHERE a.id_cliente = ? AND a.estado = 'completada'
      GROUP BY a.id_vehiculo
      ORDER BY a.id_vehiculo`,
    [clientId]
  );
  for (const vehicle of vehicles) {
    await addVehicleHistory(
      connection,
      vehicle.id_vehiculo,
      `Venta #${saleId}:`,
      `Venta #${saleId} pagada después de la cita #${vehicle.id_agendamiento}`,
      date
    );
  }
}

async function getAll() {
  await ensureClientRelationColumns();
  await ensureAppointmentRelationColumn();
  await ensureDetailVentaServiceColumns();
  const [rows] = await pool.query(
    `SELECT v.*, c.nombre AS cliente_nombre, c.apellido AS cliente_apellido,
            um.nombre AS mecanico_nombre, um.apellido AS mecanico_apellido,
            dv.id_detalle_venta, dv.id_repuesto, dv.id_servicio, dv.nombre_servicio,
            dv.cantidad, dv.precio_unitario, dv.subtotal,
            r.nombre AS nombre_repuesto, s.nombre AS nombre_servicio_catalogo,
            mp.nombre AS metodo_pago_nombre
       FROM ${TABLE} v
       LEFT JOIN clientes c ON c.id_cliente = v.id_cliente
       LEFT JOIN agendamiento a ON a.id_agendamiento = v.id_agendamiento
       LEFT JOIN mecanicos m ON m.id_mecanico = a.id_mecanico
       LEFT JOIN usuarios um ON um.id_usuario = m.id_usuario
       LEFT JOIN detalle_venta dv ON dv.id_venta = v.${PK}
       LEFT JOIN repuestos r ON r.id_repuesto = dv.id_repuesto
       LEFT JOIN servicios s ON s.id_servicio = dv.id_servicio
       LEFT JOIN metodo_pago mp ON mp.id_metodo_pago = v.id_metodo_pago
      ORDER BY v.fecha_venta DESC, v.${PK} DESC, dv.id_detalle_venta`
  );
  return mapSaleRows(rows);
}

async function getById(id) {
  const connection = await pool.getConnection();
  try {
    await ensureClientRelationColumns(connection);
    await ensureAppointmentRelationColumn(connection);
    await ensureDetailVentaServiceColumns(connection);
    return await getVenta(connection, id);
  } finally {
    connection.release();
  }
}

async function create(data) {
  await ensureClientRelationColumns();
  await ensureAppointmentRelationColumn();
  await ensureDetailVentaServiceColumns();
  const { id_cliente, fecha_venta, total, id_metodo_pago, estado } = data;
  const items = getRepuestoItems(data);
  const serviceItems = getServiceItems(data);
  const connection = await pool.getConnection();
  let saleId;
  try {
    await connection.beginTransaction();
    const [clients] = await connection.query('SELECT id_usuario FROM clientes WHERE id_cliente = ?', [id_cliente]);
    if (clients.length === 0) throw new Error('El cliente seleccionado no existe.');
    const appointmentId = await getAppointmentId(connection, id_cliente, data.id_cita ?? data.id_agendamiento);
    const [result] = await connection.query(
      `INSERT INTO ${TABLE}
        (id_usuario, id_cliente, id_agendamiento, fecha_venta, total, id_metodo_pago, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [clients[0].id_usuario, id_cliente, appointmentId, fecha_venta, total, id_metodo_pago, estado]
    );
    saleId = result.insertId;
    if (estado !== 'cancelada') {
      await insertItems(connection, saleId, items);
      await insertServiceItems(connection, saleId, serviceItems);
    }
    if (estado === 'pagada') await addSaleHistory(connection, saleId, id_cliente, fecha_venta);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  return getById(saleId);
}

async function update(id, data) {
  await ensureClientRelationColumns();
  await ensureAppointmentRelationColumn();
  await ensureDetailVentaServiceColumns();
  const { id_cliente, fecha_venta, total, id_metodo_pago, estado } = data;
  const items = estado === 'cancelada' ? [] : getRepuestoItems(data);
  const serviceItems = estado === 'cancelada' ? [] : getServiceItems(data);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [existingSales] = await connection.query(
      `SELECT estado FROM ${TABLE} WHERE ${PK} = ? FOR UPDATE`,
      [id]
    );
    if (existingSales.length === 0) {
      await connection.rollback();
      return null;
    }
    const [clients] = await connection.query('SELECT id_usuario FROM clientes WHERE id_cliente = ?', [id_cliente]);
    if (clients.length === 0) throw new Error('El cliente seleccionado no existe.');
    const appointmentId = await getAppointmentId(connection, id_cliente, data.id_cita ?? data.id_agendamiento);
    const [existingItems] = await connection.query(
      'SELECT id_repuesto, cantidad FROM detalle_venta WHERE id_venta = ? AND id_repuesto IS NOT NULL FOR UPDATE',
      [id]
    );
    const [existingServiceItems] = await connection.query(
      'SELECT id_servicio, nombre_servicio, precio_unitario FROM detalle_venta WHERE id_venta = ? AND id_repuesto IS NULL FOR UPDATE',
      [id]
    );
    if (existingSales[0].estado !== 'cancelada') {
      for (const item of existingItems) {
        await connection.query(
          'UPDATE repuestos SET stock = stock + ? WHERE id_repuesto = ?',
          [item.cantidad, item.id_repuesto]
        );
      }
    }
    await connection.query('DELETE FROM detalle_venta WHERE id_venta = ?', [id]);
    await connection.query(
      `UPDATE ${TABLE} SET id_usuario = ?, id_cliente = ?, id_agendamiento = ?, fecha_venta = ?, total = ?, id_metodo_pago = ?, estado = ? WHERE ${PK} = ?`,
      [clients[0].id_usuario, id_cliente, appointmentId, fecha_venta, total, id_metodo_pago, estado, id]
    );
    if (estado !== 'cancelada') {
      await insertItems(connection, id, items);
      await insertServiceItems(connection, id, serviceItems, existingServiceItems);
    }
    if (estado === 'pagada' && existingSales[0].estado !== 'pagada') {
      await addSaleHistory(connection, id, id_cliente, fecha_venta);
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
  const [result] = await pool.query(`DELETE FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
