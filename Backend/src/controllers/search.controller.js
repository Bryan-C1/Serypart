const pool = require('../config/db');

const searchTargets = [
  {
    type: 'clientes',
    label: 'Cliente',
    sql: `SELECT u.id_usuario AS id,
                 CONCAT_WS(' ', u.nombre, u.apellido) AS title,
                 CONCAT_WS(' · ', NULLIF(u.email, ''), NULLIF(u.telefono, '')) AS subtitle,
                 CONCAT_WS(' ', u.nombre, u.apellido, u.email, u.telefono, u.numero_documento) AS searchable
            FROM usuarios u
           WHERE CONCAT_WS(' ', u.nombre, u.apellido, u.email, u.telefono, u.numero_documento) LIKE ?
           ORDER BY u.nombre
           LIMIT 8`,
  },
  {
    type: 'vehiculos',
    label: 'Vehículo',
    sql: `SELECT v.id_vehiculo AS id,
                 v.placa AS title,
                 CONCAT_WS(' · ', NULLIF(m.nombre, ''), NULLIF(md.nombre, ''), NULLIF(CONCAT_WS(' ', u.nombre, u.apellido), '')) AS subtitle,
                 CONCAT_WS(' ', v.placa, v.color, m.nombre, md.nombre, u.nombre, u.apellido) AS searchable
            FROM vehiculos v
            LEFT JOIN marca m ON m.id_marca = v.id_marca
            LEFT JOIN modelo md ON md.id_modelo = v.id_modelo
            LEFT JOIN usuarios u ON u.id_usuario = v.id_usuario
           WHERE CONCAT_WS(' ', v.placa, v.color, m.nombre, md.nombre, u.nombre, u.apellido) LIKE ?
           ORDER BY v.id_vehiculo DESC
           LIMIT 8`,
  },
  {
    type: 'servicios',
    label: 'Servicio',
    sql: `SELECT id_servicio AS id, nombre AS title, descripcion AS subtitle,
                 CONCAT_WS(' ', nombre, descripcion, estado) AS searchable
            FROM servicios
           WHERE CONCAT_WS(' ', nombre, descripcion, estado) LIKE ?
           ORDER BY nombre
           LIMIT 8`,
  },
  {
    type: 'repuestos',
    label: 'Repuesto',
    sql: `SELECT id_repuesto AS id, nombre AS title, descripcion AS subtitle,
                 CONCAT_WS(' ', nombre, descripcion, estado) AS searchable
            FROM repuestos
           WHERE CONCAT_WS(' ', nombre, descripcion, estado) LIKE ?
           ORDER BY nombre
           LIMIT 8`,
  },
  {
    type: 'proveedores',
    label: 'Proveedor',
    sql: `SELECT id_proveedor AS id, nombre_empresa AS title,
                 CONCAT_WS(' · ', NULLIF(nombre_cliente, ''), NULLIF(email, ''), NULLIF(telefono, '')) AS subtitle,
                 CONCAT_WS(' ', nombre_empresa, nombre_cliente, nit, email, telefono, direccion) AS searchable
            FROM proveedor
           WHERE CONCAT_WS(' ', nombre_empresa, nombre_cliente, nit, email, telefono, direccion) LIKE ?
           ORDER BY nombre_empresa
           LIMIT 8`,
  },
  {
    type: 'citas',
    label: 'Cita',
    sql: `SELECT a.id_agendamiento AS id,
                 CONCAT('Cita #', a.id_agendamiento, ' · ', DATE_FORMAT(a.fecha_cita, '%d/%m/%Y')) AS title,
                 CONCAT_WS(' · ', CONCAT_WS(' ', u.nombre, u.apellido), v.placa, s.nombre, a.estado) AS subtitle,
                 CONCAT_WS(' ', a.id_agendamiento, a.fecha_cita, a.estado, a.observaciones, u.nombre, u.apellido, u.email, v.placa, s.nombre) AS searchable
            FROM agendamiento a
            LEFT JOIN usuarios u ON u.id_usuario = a.id_usuario
            LEFT JOIN vehiculos v ON v.id_vehiculo = a.id_vehiculo
            LEFT JOIN servicios s ON s.id_servicio = a.id_servicio
           WHERE CONCAT_WS(' ', a.id_agendamiento, a.fecha_cita, a.estado, a.observaciones, u.nombre, u.apellido, u.email, v.placa, s.nombre) LIKE ?
           ORDER BY a.fecha_cita DESC
           LIMIT 8`,
  },
  {
    type: 'ventas',
    label: 'Venta',
    sql: `SELECT v.id_venta AS id,
                 CONCAT('Venta #', v.id_venta) AS title,
                 CONCAT_WS(' · ', CONCAT_WS(' ', u.nombre, u.apellido), DATE_FORMAT(v.fecha_venta, '%d/%m/%Y'), CONCAT('$', v.total), v.estado) AS subtitle,
                 CONCAT_WS(' ', v.id_venta, v.fecha_venta, v.total, v.estado, u.nombre, u.apellido, u.email) AS searchable
            FROM venta v
            LEFT JOIN usuarios u ON u.id_usuario = v.id_usuario
           WHERE CONCAT_WS(' ', v.id_venta, v.fecha_venta, v.total, v.estado, u.nombre, u.apellido, u.email) LIKE ?
           ORDER BY v.fecha_venta DESC
           LIMIT 8`,
  },
  {
    type: 'compras',
    label: 'Compra',
    sql: `SELECT c.id_compra AS id,
                 CONCAT('Compra #', c.id_compra) AS title,
                 CONCAT_WS(' · ', p.nombre_empresa, DATE_FORMAT(c.fecha_compra, '%d/%m/%Y'), CONCAT('$', c.total), c.estado) AS subtitle,
                 CONCAT_WS(' ', c.id_compra, c.fecha_compra, c.total, c.estado, p.nombre_empresa, p.nombre_cliente, p.nit) AS searchable
            FROM compra c
            LEFT JOIN proveedor p ON p.id_proveedor = c.id_proveedor
           WHERE CONCAT_WS(' ', c.id_compra, c.fecha_compra, c.total, c.estado, p.nombre_empresa, p.nombre_cliente, p.nit) LIKE ?
           ORDER BY c.fecha_compra DESC
           LIMIT 8`,
  },
];

const detailQueries = {
  vehiculos: `SELECT v.*, m.nombre AS marca, md.nombre AS modelo, tv.nombre AS tipo_vehiculo,
                     u.nombre AS nombre_cliente, u.apellido AS apellido_cliente
                FROM vehiculos v
                LEFT JOIN marca m ON m.id_marca = v.id_marca
                LEFT JOIN modelo md ON md.id_modelo = v.id_modelo
                LEFT JOIN tipo_vehiculo tv ON tv.id_tipo_vehiculo = v.id_tipo_vehiculo
                LEFT JOIN usuarios u ON u.id_usuario = v.id_usuario
               WHERE v.id_vehiculo = ?`,
  servicios: 'SELECT * FROM servicios WHERE id_servicio = ?',
  repuestos: 'SELECT * FROM repuestos WHERE id_repuesto = ?',
  proveedores: 'SELECT * FROM proveedor WHERE id_proveedor = ?',
  citas: `SELECT a.*, CONCAT_WS(' ', u.nombre, u.apellido) AS cliente, v.placa,
                 s.nombre AS servicio
            FROM agendamiento a
            LEFT JOIN usuarios u ON u.id_usuario = a.id_usuario
            LEFT JOIN vehiculos v ON v.id_vehiculo = a.id_vehiculo
            LEFT JOIN servicios s ON s.id_servicio = a.id_servicio
           WHERE a.id_agendamiento = ?`,
  ventas: `SELECT v.*, CONCAT_WS(' ', u.nombre, u.apellido) AS cliente, mp.nombre AS metodo_pago
             FROM venta v
             LEFT JOIN usuarios u ON u.id_usuario = v.id_usuario
             LEFT JOIN metodo_pago mp ON mp.id_metodo_pago = v.id_metodo_pago
            WHERE v.id_venta = ?`,
  compras: `SELECT c.*, p.nombre_empresa AS proveedor
              FROM compra c
              LEFT JOIN proveedor p ON p.id_proveedor = c.id_proveedor
             WHERE c.id_compra = ?`,
};

function likeTerm(value) {
  return `%${value.replace(/[\\%_]/g, '\\$&')}%`;
}

async function search(req, res, next) {
  const query = String(req.query.q || '').trim();
  if (query.length < 2) return res.json([]);

  try {
    const resultsByTarget = await Promise.all(searchTargets.map(async (target) => {
      const [rows] = await pool.query(target.sql, [likeTerm(query)]);
      return rows.map(({ searchable, ...row }) => ({
        ...row,
        type: target.type,
        label: target.label,
        source: 'database',
      }));
    }));
    res.json(resultsByTarget.flat());
  } catch (error) {
    next(error);
  }
}

async function getClientDetails(req, res, next) {
  try {
    const id = req.params.id;
    const [users] = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.apellido, u.numero_documento, u.tipo_documento,
              u.fecha_registro, u.email, u.telefono, u.estado, r.nombre AS rol
         FROM usuarios u
         LEFT JOIN roles r ON r.id_rol = u.id_rol
        WHERE u.id_usuario = ?`,
      [id]
    );
    if (!users.length) return res.status(404).json({ message: 'Cliente no encontrado.' });

    const [vehicles] = await pool.query(
      `SELECT v.*, m.nombre AS marca, md.nombre AS modelo, tv.nombre AS tipo_vehiculo
         FROM vehiculos v
         LEFT JOIN marca m ON m.id_marca = v.id_marca
         LEFT JOIN modelo md ON md.id_modelo = v.id_modelo
         LEFT JOIN tipo_vehiculo tv ON tv.id_tipo_vehiculo = v.id_tipo_vehiculo
        WHERE v.id_usuario = ?
        ORDER BY v.id_vehiculo DESC`,
      [id]
    );
    const [appointments] = await pool.query(
      `SELECT a.id_agendamiento, a.fecha_cita, a.hora_cita, a.estado, a.observaciones,
              v.id_vehiculo, v.placa,
              GROUP_CONCAT(DISTINCT COALESCE(sd.nombre, s.nombre) ORDER BY COALESCE(sd.nombre, s.nombre) SEPARATOR ', ') AS servicios
         FROM agendamiento a
         LEFT JOIN vehiculos v ON v.id_vehiculo = a.id_vehiculo
         LEFT JOIN servicios s ON s.id_servicio = a.id_servicio
         LEFT JOIN detalle_agendamiento da ON da.id_agendamiento = a.id_agendamiento
         LEFT JOIN servicios sd ON sd.id_servicio = da.id_servicio
        WHERE a.id_usuario = ?
        GROUP BY a.id_agendamiento, a.fecha_cita, a.hora_cita, a.estado,
                 a.observaciones, v.id_vehiculo, v.placa
        ORDER BY a.fecha_cita DESC, a.hora_cita DESC`,
      [id]
    );
    const [sales] = await pool.query(
      `SELECT v.id_venta, v.fecha_venta, v.total, v.estado, mp.nombre AS metodo_pago
         FROM venta v
         LEFT JOIN metodo_pago mp ON mp.id_metodo_pago = v.id_metodo_pago
        WHERE v.id_usuario = ?
        ORDER BY v.fecha_venta DESC, v.id_venta DESC`,
      [id]
    );

    let vehicleHistory = [];
    if (vehicles.length) {
      const placeholders = vehicles.map(() => '?').join(', ');
      const vehicleIds = vehicles.map((vehicle) => vehicle.id_vehiculo);
      const [history] = await pool.query(
        `SELECT h.*, v.placa
           FROM historial_vehiculos h
           LEFT JOIN vehiculos v ON v.id_vehiculo = h.id_vehiculo
          WHERE h.id_vehiculo IN (${placeholders})
          ORDER BY h.fecha DESC`,
        vehicleIds
      );
      vehicleHistory = history;
    }

    const salesWithItems = await Promise.all(sales.map(async (sale) => {
      const [items] = await pool.query(
        `SELECT dv.id_detalle_venta, dv.id_repuesto, r.nombre AS repuesto,
                dv.cantidad, dv.precio_unitario, dv.subtotal
           FROM detalle_venta dv
           LEFT JOIN repuestos r ON r.id_repuesto = dv.id_repuesto
          WHERE dv.id_venta = ?`,
        [sale.id_venta]
      );
      return { ...sale, items };
    }));

    res.json({
      cliente: users[0],
      vehiculos: vehicles,
      citas: appointments,
      ventas: salesWithItems,
      historialVehiculos: vehicleHistory,
    });
  } catch (error) {
    next(error);
  }
}

async function getEntityDetails(req, res, next) {
  const { type, id } = req.params;
  const query = detailQueries[type];
  if (!query) return res.status(404).json({ message: 'Tipo de registro no disponible.' });

  try {
    const [rows] = await pool.query(query, [id]);
    if (!rows.length) return res.status(404).json({ message: 'Registro no encontrado.' });
    const record = rows[0];
    if (type === 'ventas' || type === 'compras') {
      const table = type === 'ventas' ? 'detalle_venta' : 'detalle_compra';
      const foreignKey = type === 'ventas' ? 'id_venta' : 'id_compra';
      const [items] = await pool.query(
        `SELECT d.id_repuesto, r.nombre AS repuesto, d.cantidad,
                d.precio_unitario, d.subtotal
           FROM ${table} d
           LEFT JOIN repuestos r ON r.id_repuesto = d.id_repuesto
          WHERE d.${foreignKey} = ?`,
        [id]
      );
      record.items = items;
    }
    res.json(record);
  } catch (error) {
    next(error);
  }
}

module.exports = { search, getClientDetails, getEntityDetails };
