import { initialClientes } from "../../clientes/services/clientesData";
import {
  getMarcaNombre,
  getModeloNombre,
  getTipoVehiculoNombre,
  initialVehiculos,
} from "../../vehiculos/services/vehiculosData";
import { initialServicios, servicioImagenes } from "../../servicios/services/serviciosData";
import { citas, getServicioNombre, getVehiculoNombre, getUsuarioNombre } from "../../agendamiento/services/agendamientoData";
import { initialVentas } from "../../ventas/services/ventasData";
import { initialRepuestos } from "../../repuestos/services/repuestosData";
import { initialProveedores } from "../../proveedores/services/proveedoresData";
import { initialCompras } from "../../compras/services/comprasData";
import { apiRequest } from "../../../../shared/services/api";

const fixtureGroups = [
  {
    type: "clientes",
    label: "Cliente",
    items: initialClientes.map((item) => ({
      id: item.id,
      title: item.nombre,
      subtitle: [item.cedula, item.telefono, item.email].filter(Boolean).join(" · "),
      details: item,
    })),
  },
  {
    type: "vehiculos",
    label: "Vehículo",
    items: initialVehiculos.map((item) => ({
      id: item.id,
      title: item.placa,
      subtitle: [
        getMarcaNombre(item.id_marca),
        getModeloNombre(item.id_modelo),
        item.color,
        item.año,
      ].filter(Boolean).join(" · "),
      details: {
        ...item,
        marca: getMarcaNombre(item.id_marca),
        modelo: getModeloNombre(item.id_modelo),
        tipo_vehiculo: getTipoVehiculoNombre(item.id_tipo_vehiculo),
      },
    })),
  },
  {
    type: "servicios",
    label: "Servicio",
    items: initialServicios.map((item) => ({
      id: item.id,
      title: item.nombre,
      subtitle: `${item.descripcion} · $${item.precio}`,
      details: { ...item, foto: item.imagen || servicioImagenes[item.id] || "" },
    })),
  },
  {
    type: "citas",
    label: "Cita",
    items: citas.map((item) => ({
      id: item.id,
      title: `Cita #${item.id}`,
      subtitle: `${getUsuarioNombre(item.id_usuario)} · ${getVehiculoNombre(item.id_vehiculo)} · ${getServicioNombre(item.id_servicio)} · ${item.fecha_cita}`,
      details: item,
    })),
  },
  {
    type: "ventas",
    label: "Venta",
    items: initialVentas.map((item) => ({
      id: item.id_venta,
      title: `Venta #${item.id_venta}`,
      subtitle: `Cliente #${item.id_usuario} · ${item.fecha_venta} · $${item.total} · ${item.estado}`,
      details: item,
    })),
  },
  {
    type: "repuestos",
    label: "Repuesto",
    items: initialRepuestos.map((item) => ({
      id: item.id_repuesto,
      title: item.nombre,
      subtitle: `${item.descripcion} · Stock: ${item.stock}`,
      details: item,
    })),
  },
  {
    type: "proveedores",
    label: "Proveedor",
    items: initialProveedores.map((item) => ({
      id: item.id_proveedor,
      title: item.nombre_empresa,
      subtitle: `${item.nombre_cliente} · ${item.nit} · ${item.telefono}`,
      details: item,
    })),
  },
  {
    type: "compras",
    label: "Compra",
    items: initialCompras.map((item) => ({
      id: item.id_compra,
      title: `Compra #${item.id_compra}`,
      subtitle: `Proveedor #${item.id_proveedor} · ${item.fecha_compra} · $${item.total} · ${item.estado}`,
      details: item,
    })),
  },
];

function normalize(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function searchLocalRecords(query) {
  const term = normalize(query).trim();
  if (term.length < 2) return [];

  return fixtureGroups.flatMap((group) => group.items
    .filter((item) => normalize(`${item.title} ${item.subtitle} ${JSON.stringify(item.details)}`).includes(term))
    .map((item) => ({
      ...item,
      type: group.type,
      label: group.label,
      source: "example",
      id: `demo-${item.id}`,
      rawId: item.id,
    })));
}

export async function searchAllRecords(query) {
  const demoResults = searchLocalRecords(query);
  let databaseResults = [];
  let error = "";
  try {
    databaseResults = await apiRequest(`/busqueda?q=${encodeURIComponent(query)}`);
  } catch (requestError) {
    error = requestError.message;
  }

  const databaseKeys = new Set(databaseResults.map((item) => `${item.type}:${normalize(item.title)}`));
  const examplesNotInDatabase = demoResults.filter(
    (item) => !databaseKeys.has(`${item.type}:${normalize(item.title)}`)
  );
  return { results: [...databaseResults, ...examplesNotInDatabase], error };
}

export async function getSearchRecord(type, id) {
  return apiRequest(`/busqueda/${encodeURIComponent(type)}/${encodeURIComponent(id)}`);
}

export async function getClientProfile(id) {
  return apiRequest(`/busqueda/clientes/${encodeURIComponent(id)}`);
}

export function getExampleClientProfile(id) {
  const rawId = Number(id);
  const cliente = initialClientes.find((item) => item.id === rawId);
  if (!cliente) return null;

  const nombre = cliente.nombre.toLowerCase();
  const vehicleRecords = initialVehiculos.filter((vehicle) => Number(vehicle.id_usuario) === rawId);
  const appointmentRecords = citas.filter((appointment) => Number(appointment.id_usuario) === rawId);
  const saleRecords = initialVentas.filter((sale) => Number(sale.id_usuario) === rawId);

  return {
    cliente,
    vehiculos: vehicleRecords.map((vehicle) => ({
      ...vehicle,
      marca: getMarcaNombre(vehicle.id_marca),
      modelo: getModeloNombre(vehicle.id_modelo),
      tipo_vehiculo: getTipoVehiculoNombre(vehicle.id_tipo_vehiculo),
      nombre_cliente: nombre,
    })),
    citas: appointmentRecords.map((appointment) => ({
      ...appointment,
      servicios: getServicioNombre(appointment.id_servicio),
      placa: vehicleRecords.find((vehicle) => vehicle.id === appointment.id_vehiculo)?.placa || "",
    })),
    ventas: saleRecords,
    historialVehiculos: [],
  };
}

export function findExampleRecord(type, id) {
  for (const group of fixtureGroups) {
    if (group.type !== type) continue;
    const item = group.items.find((record) => String(record.id) === String(id));
    if (item) return { ...item, type, label: group.label, source: "example" };
  }
  return null;
}

export function getEntityPath(type, id) {
  const paths = {
    clientes: "/clientes",
    vehiculos: "/vehiculos",
    servicios: "/servicios",
    citas: "/agendamiento",
    ventas: "/ventas",
    repuestos: "/repuestos",
    proveedores: "/proveedores",
    compras: "/compras",
    mecanicos: "/mecanicos",
  };
  return paths[type] ? `${paths[type]}?buscar=${encodeURIComponent(id)}` : "/";
}

export function getVisibleRecordFields(record) {
  return Object.entries(record || {}).filter(([key, value]) => (
    !/password|contrase|secret|token/i.test(key) &&
    value !== null && value !== undefined && value !== "" &&
    !["id", "source", "label", "type", "searchable"].includes(key)
  ));
}
