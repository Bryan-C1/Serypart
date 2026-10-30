const pool = require('../config/db');

const TABLE = 'clientes';
const PK = 'id_cliente';

async function ensureClientRelationColumns(connection = pool) {
  const tables = [
    { table: 'vehiculos', column: 'id_cliente' },
    { table: 'venta', column: 'id_cliente' },
    { table: 'agendamiento', column: 'id_cliente' },
  ];

  for (const { table, column } of tables) {
    const [columns] = await connection.query(`SHOW COLUMNS FROM ${table} LIKE ?`, [column]);
    if (columns.length !== 0) continue;
    await connection.query(`ALTER TABLE ${table} ADD COLUMN ${column} INT NULL`);
  }
}

async function getAll() {
  await ensureClientRelationColumns();
  const [rows] = await pool.query(
    `SELECT c.*,
            (SELECT COUNT(*) FROM vehiculos v WHERE v.id_cliente = c.${PK}) AS vehiculos,
            (SELECT MAX(v.fecha_venta) FROM venta v WHERE v.id_cliente = c.${PK}) AS ultima_visita
       FROM ${TABLE} c
      ORDER BY c.nombre, c.apellido`
  );
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE ${PK} = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  await ensureClientRelationColumns();
  const { nombre, apellido, tipo_documento, numero_documento, fecha_registro, email, telefono, direccion, estado } = data;
  const [result] = await pool.query(
    `INSERT INTO ${TABLE}
      (nombre, apellido, tipo_documento, numero_documento, fecha_registro, email, telefono, direccion, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, apellido, tipo_documento || null, numero_documento, fecha_registro || null, email || null, telefono || null, direccion || null, estado || 'activo']
  );
  return getById(result.insertId);
}

async function saveCascadeStates(connection, clientId, entity, rows) {
  for (const row of rows) {
    await connection.query(
      `INSERT INTO cliente_cascade_states (id_cliente, entidad, id_registro, estado_anterior)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE estado_anterior = estado_anterior`,
      [clientId, entity, row.id, row.estado]
    );
  }
}

async function restoreCascade(connection, clientId) {
  const [rows] = await connection.query(
    `SELECT entidad, id_registro, estado_anterior
       FROM cliente_cascade_states
      WHERE id_cliente = ?
      FOR UPDATE`,
    [clientId]
  );

  const salesToRestore = rows.filter((row) => row.entidad === 'venta');
  for (const sale of salesToRestore) {
    const [items] = await connection.query(
      `SELECT dv.id_repuesto, SUM(dv.cantidad) AS cantidad
         FROM detalle_venta dv
         JOIN venta v ON v.id_venta = dv.id_venta
        WHERE dv.id_venta = ? AND v.id_cliente = ? AND v.estado = 'cancelada'
        GROUP BY dv.id_repuesto`,
      [sale.id_registro, clientId]
    );
    for (const item of items) {
      const [result] = await connection.query(
        `UPDATE repuestos
            SET stock = stock - ?
          WHERE id_repuesto = ? AND stock >= ?`,
        [item.cantidad, item.id_repuesto, item.cantidad]
      );
      if (result.affectedRows === 0) {
        throw new Error(`No hay stock suficiente para reactivar la venta ${sale.id_registro}.`);
      }
    }
    await connection.query(
      `UPDATE venta SET estado = ? WHERE id_venta = ? AND id_cliente = ? AND estado = 'cancelada'`,
      [sale.estado_anterior, sale.id_registro, clientId]
    );
  }

  for (const row of rows) {
    if (row.entidad === 'vehiculo') {
      await connection.query(
        `UPDATE vehiculos SET estado = ? WHERE id_vehiculo = ? AND id_cliente = ? AND estado = 'anulado'`,
        [row.estado_anterior, row.id_registro, clientId]
      );
    } else if (row.entidad === 'cita') {
      await connection.query(
        `UPDATE agendamiento SET estado = ? WHERE id_agendamiento = ? AND id_cliente = ? AND estado = 'cancelada'`,
        [row.estado_anterior, row.id_registro, clientId]
      );
    }
  }

  await connection.query(
    'DELETE FROM cliente_cascade_states WHERE id_cliente = ?',
    [clientId]
  );
}

async function annulRelatedRecords(connection, clientId) {
  const [vehicles] = await connection.query(
    `SELECT id_vehiculo AS id, estado FROM vehiculos
      WHERE id_cliente = ? AND estado <> 'anulado'
      FOR UPDATE`,
    [clientId]
  );
  const [appointments] = await connection.query(
    `SELECT id_agendamiento AS id, estado FROM agendamiento
      WHERE id_cliente = ? AND estado <> 'cancelada'
      FOR UPDATE`,
    [clientId]
  );
  const [sales] = await connection.query(
    `SELECT id_venta AS id, estado FROM venta
      WHERE id_cliente = ? AND estado <> 'cancelada'
      FOR UPDATE`,
    [clientId]
  );

  await saveCascadeStates(connection, clientId, 'vehiculo', vehicles);
  await saveCascadeStates(connection, clientId, 'cita', appointments);
  await saveCascadeStates(connection, clientId, 'venta', sales);

  if (sales.length > 0) {
    const saleIds = sales.map((sale) => sale.id);
    const placeholders = saleIds.map(() => '?').join(', ');
    const [stockByPart] = await connection.query(
      `SELECT id_repuesto, SUM(cantidad) AS cantidad
         FROM detalle_venta
        WHERE id_venta IN (${placeholders})
        GROUP BY id_repuesto`,
      saleIds
    );
    for (const item of stockByPart) {
      await connection.query(
        'UPDATE repuestos SET stock = stock + ? WHERE id_repuesto = ?',
        [item.cantidad, item.id_repuesto]
      );
    }
    await connection.query(
      `UPDATE venta SET estado = 'cancelada' WHERE id_venta IN (${placeholders})`,
      saleIds
    );
  }

  if (vehicles.length > 0) {
    const ids = vehicles.map((vehicle) => vehicle.id);
    const placeholders = ids.map(() => '?').join(', ');
    await connection.query(
      `UPDATE vehiculos SET estado = 'anulado' WHERE id_vehiculo IN (${placeholders})`,
      ids
    );
  }

  if (appointments.length > 0) {
    const ids = appointments.map((appointment) => appointment.id);
    const placeholders = ids.map(() => '?').join(', ');
    await connection.query(
      `UPDATE agendamiento SET estado = 'cancelada' WHERE id_agendamiento IN (${placeholders})`,
      ids
    );
  }
}

async function update(id, data) {
  const connection = await pool.getConnection();
  const fields = ['nombre', 'apellido', 'tipo_documento', 'numero_documento', 'fecha_registro', 'email', 'telefono', 'direccion', 'estado'];
  try {
    await connection.beginTransaction();
    const [existingRows] = await connection.query(
      `SELECT estado FROM ${TABLE} WHERE ${PK} = ? FOR UPDATE`,
      [id]
    );
    if (existingRows.length === 0) {
      await connection.rollback();
      return null;
    }
    const previousState = existingRows[0].estado;
    const assignments = [];
    const values = [];

    for (const field of fields) {
      if (Object.prototype.hasOwnProperty.call(data, field)) {
        assignments.push(`${field} = ?`);
        values.push(data[field] ?? null);
      }
    }

    if (assignments.length > 0) {
      await connection.query(
        `UPDATE ${TABLE} SET ${assignments.join(', ')} WHERE ${PK} = ?`,
        [...values, id]
      );
    }

    const nextState = Object.prototype.hasOwnProperty.call(data, 'estado')
      ? data.estado
      : previousState;
    if (previousState !== 'inactivo' && nextState === 'inactivo') {
      await connection.query(
        `UPDATE vehiculos SET estado = 'inactivo' WHERE id_cliente = ?`,
        [id]
      );
    } else if (nextState === 'anulado') {
      await annulRelatedRecords(connection, id);
    } else if (previousState === 'anulado' && nextState === 'activo') {
      await restoreCascade(connection, id);
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
    const [result] = await connection.query(
      `DELETE c FROM ${TABLE} c
        WHERE c.${PK} = ?
          AND NOT EXISTS (
            SELECT 1 FROM vehiculos v WHERE v.id_cliente = c.${PK}
          )`,
      [id]
    );
    if (result.affectedRows === 0) {
      const [rows] = await connection.query(
        `SELECT c.${PK}, EXISTS (
           SELECT 1 FROM vehiculos v WHERE v.id_cliente = c.${PK}
         ) AS tiene_vehiculos
           FROM ${TABLE} c
          WHERE c.${PK} = ?`,
        [id]
      );
      if (rows.length === 0) {
        await connection.rollback();
        return false;
      }
      if (rows[0].tiene_vehiculos) {
        const error = new Error('No se puede eliminar un cliente que tiene vehículos asociados.');
        error.status = 409;
        throw error;
      }
      await connection.rollback();
      return false;
    }
    await connection.query('DELETE FROM cliente_cascade_states WHERE id_cliente = ?', [id]);
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
