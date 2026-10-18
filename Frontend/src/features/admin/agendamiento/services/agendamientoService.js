import { apiRequest } from "../../../../shared/services/api";
import { getClientes } from "../../clientes/services/clientesService";
import { getServicios } from "../../servicios/services/serviciosService";

export const CITAS_UPDATED_EVENT = "serypart-citas-updated";

let citasCache = [];

function normalizeDate(value) {
  if (value instanceof Date) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  }
  return String(value || "").slice(0, 10);
}

function fromApi(cita) {
  const servicios = (cita.servicios || [])
    .map((servicio) => ({
      ...servicio,
      id: Number(servicio.id_servicio ?? servicio.id),
      id_servicio: Number(servicio.id_servicio ?? servicio.id),
    }))
    .filter((servicio) => Number.isFinite(servicio.id));
  const idServicio = Number(cita.id_servicio);

  return {
    ...cita,
    id: Number(cita.id_agendamiento ?? cita.id),
    id_agendamiento: Number(cita.id_agendamiento ?? cita.id),
    id_servicio: Number.isFinite(idServicio) ? idServicio : servicios[0]?.id,
    id_vehiculo: Number(cita.id_vehiculo),
    id_usuario: cita.id_usuario == null ? null : Number(cita.id_usuario),
    id_cliente: Number(cita.id_cliente),
    fecha_cita: normalizeDate(cita.fecha_cita),
    hora_cita: String(cita.hora_cita || "").slice(0, 5),
    servicios: servicios.length
      ? servicios
      : Number.isFinite(idServicio) ? [{ id: idServicio, id_servicio: idServicio }] : [],
  };
}

function setCitasCache(citas) {
  citasCache = citas;
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CITAS_UPDATED_EVENT));
}

export function getCitasGuardadas() {
  return citasCache;
}

export async function getCitas() {
  const rows = await apiRequest("/agendamiento");
  if (!Array.isArray(rows)) throw new Error("La API devolvió un formato inválido para las citas.");
  const citas = rows.map(fromApi);
  setCitasCache(citas);
  return citas;
}

export async function getAgendamientoCatalogs() {
  const [clientes, vehiculos, servicios] = await Promise.all([
    getClientes(),
    apiRequest("/vehiculos"),
    getServicios(),
  ]);
  if (!Array.isArray(clientes) || !Array.isArray(vehiculos) || !Array.isArray(servicios)) {
    throw new Error("La API devolvió un formato inválido para los catálogos de agendamiento.");
  }

  return {
    clientes: clientes
      .filter((cliente) => String(cliente.estado || "").toLowerCase() !== "anulado")
      .map((cliente) => ({
        id: Number(cliente.id_cliente),
        id_cliente: Number(cliente.id_cliente),
        nombre: [cliente.nombre, cliente.apellido].filter(Boolean).join(" "),
      })),
    vehiculos: vehiculos.map((vehiculo) => ({
      ...vehiculo,
      id: Number(vehiculo.id_vehiculo),
      id_cliente: Number(vehiculo.id_cliente),
      id_usuario: vehiculo.id_usuario == null ? null : Number(vehiculo.id_usuario),
      año: Number(vehiculo.anio),
      nombre: [vehiculo.placa, vehiculo.marca, vehiculo.modelo].filter(Boolean).join(" "),
      saldo_a_deber: Number(vehiculo.saldo_a_deber || 0),
    })),
    servicios,
  };
}

function toApi(cita, servicios) {
  const serviceIds = servicios.map((servicio) => Number(servicio.id_servicio ?? servicio.id));
  const now = new Date();
  const fechaRegistro = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return {
    id_servicio: serviceIds[0],
    servicios: serviceIds.map((id) => ({ id_servicio: id })),
    id_vehiculo: Number(cita.id_vehiculo),
    id_cliente: Number(cita.id_cliente),
    fecha_cita: cita.fecha_cita,
    hora_cita: cita.hora_cita,
    estado: cita.estado,
    observaciones: cita.observaciones || "",
    fecha_registro: cita.fecha_registro || fechaRegistro,
  };
}

export async function createCita(cita, servicios) {
  const created = fromApi(await apiRequest("/agendamiento", {
    method: "POST",
    body: toApi(cita, servicios),
  }));
  setCitasCache([...citasCache, created]);
  return created;
}

export async function updateCita(id, cita, servicios) {
  const updated = fromApi(await apiRequest(`/agendamiento/${id}`, {
    method: "PUT",
    body: toApi(cita, servicios),
  }));
  setCitasCache(citasCache.map((item) => item.id === Number(id) ? updated : item));
  return updated;
}
