import { getClientesGuardados, initialClientes } from "../../clientes/services/clientesData";
import {
  getMarcaNombre,
  getModeloNombre,
  getVehiculosGuardados,
  initialVehiculos,
} from "../../vehiculos/services/vehiculosData";

export const citas = [
  { id: 1, id_servicio: 1, id_vehiculo: 1, id_cliente: 1, fecha_cita: "2026-05-31", hora_cita: "09:00", estado: "programada", observaciones: "", fecha_registro: "2026-05-28" },
  { id: 2, id_servicio: 2, id_vehiculo: 2, id_cliente: 2, fecha_cita: "2026-05-31", hora_cita: "10:30", estado: "programada", observaciones: "Revisar frenos delanteros", fecha_registro: "2026-05-28" },
  { id: 3, id_servicio: 3, id_vehiculo: 3, id_cliente: 3, fecha_cita: "2026-05-31", hora_cita: "14:00", estado: "en_proceso", observaciones: "", fecha_registro: "2026-05-29" },
  { id: 4, id_servicio: 4, id_vehiculo: 4, id_cliente: 4, fecha_cita: "2026-06-01", hora_cita: "09:00", estado: "programada", observaciones: "", fecha_registro: "2026-05-30" },
];

export { CITAS_UPDATED_EVENT, getCitasGuardadas } from "./agendamientoService";

export function getFechaLocalActual() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export const servicios = [
  { id: 1, nombre: "Cambio de Aceite" },
  { id: 2, nombre: "Revisión de Frenos" },
  { id: 3, nombre: "Alineación" },
  { id: 4, nombre: "Mantenimiento" },
];

export const vehiculos = initialVehiculos.map((vehicle) => ({
  ...vehicle,
  nombre: `${vehicle.placa} ${vehicle.marca || getMarcaNombre(vehicle.id_marca)} ${vehicle.modelo || getModeloNombre(vehicle.id_modelo)}`,
  saldo_a_deber: vehicle.saldo_a_deber ?? 0,
}));

export const usuarios = initialClientes.map((cliente) => ({
  id: cliente.id,
  nombre: cliente.nombre,
}));

export function getClientesParaAgendamiento() {
  return getClientesGuardados()
    .map((cliente) => ({
      id: cliente.id,
      nombre: [cliente.nombre, cliente.apellido].filter(Boolean).join(" "),
    }));
}

export function getServicioNombre(id, nombreFallback = "") {
  return nombreFallback || servicios.find((s) => s.id === Number(id))?.nombre || "—";
}

export function getVehiculoNombre(id, nombreFallback = "") {
  return nombreFallback || getVehiculo(id)?.nombre || "—";
}

export function getVehiculo(id) {
  const vehicle = getVehiculosGuardados().find((item) => String(item.id) === String(id));
  if (!vehicle) return undefined;
  return {
    ...vehicle,
    nombre: vehicle.nombre || `${vehicle.placa} ${vehicle.marca || getMarcaNombre(vehicle.id_marca)} ${vehicle.modelo || getModeloNombre(vehicle.id_modelo)}`,
    saldo_a_deber: vehicle.saldo_a_deber ?? 0,
  };
}

export function getUsuarioNombre(id, nombreFallback = "") {
  if (nombreFallback) return nombreFallback;
  const currentClients = getClientesParaAgendamiento();
  return currentClients.find((user) => String(user.id) === String(id))?.nombre
    || usuarios.find((user) => String(user.id) === String(id))?.nombre
    || "—";
}

export const estadoLabel = {
  programada: "Programada",
  en_proceso: "En Proceso",
  completada: "Completada",
  cancelada: "Anulada",
};

export const estadoClass = {
  programada: "bg-blue-500/10 text-blue-500",
  en_proceso: "bg-warning/10 text-warning",
  completada: "bg-success/10 text-success",
  cancelada: "bg-muted text-muted-foreground",
};
