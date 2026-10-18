export const initialVehiculos = [
  { id: 1, id_cliente: 1, placa: "ABC-123", id_marca: 1, id_modelo: 1, año: 2020, color: "Blanco", id_tipo_vehiculo: 1, estado: "activo", fecha_registro: "2026-05-28" },
  { id: 2, id_cliente: 2, placa: "DEF-456", id_marca: 2, id_modelo: 2, año: 2019, color: "Negro", id_tipo_vehiculo: 1, estado: "en_servicio", fecha_registro: "2026-05-25" },
  { id: 3, id_cliente: 3, placa: "GHI-789", id_marca: 3, id_modelo: 3, año: 2021, color: "Rojo", id_tipo_vehiculo: 1, estado: "activo", fecha_registro: "2026-05-20" },
  { id: 4, id_cliente: 4, placa: "JKL-012", id_marca: 4, id_modelo: 4, año: 2018, color: "Azul", id_tipo_vehiculo: 1, estado: "activo", fecha_registro: "2026-05-15" },
];

export const emptyForm = {
  id_cliente: "", placa: "", id_marca: "", id_modelo: "", año: 2024, color: "", id_tipo_vehiculo: "",
  estado: "activo", fecha_registro: "",
};

let vehiculosGuardados = initialVehiculos;

export function getVehiculosGuardados() {
  return vehiculosGuardados;
}

export function guardarVehiculos(vehiculos) {
  vehiculosGuardados = vehiculos;
}

export const clientes = [
  { id: 1, nombre: "Juan Pérez" },
  { id: 2, nombre: "María García" },
  { id: 3, nombre: "Carlos Rodríguez" },
  { id: 4, nombre: "Ana Martínez" },
];

export const marcas = [
  { id: 1, nombre: "Toyota" },
  { id: 2, nombre: "Honda" },
  { id: 3, nombre: "Chevrolet" },
  { id: 4, nombre: "Ford" },
  { id: 5, nombre: "Renault" },
];

export const modelos = [
  { id: 1, id_marca: 1, nombre: "Corolla" },
  { id: 2, id_marca: 2, nombre: "Civic" },
  { id: 3, id_marca: 3, nombre: "Spark" },
  { id: 4, id_marca: 4, nombre: "Fiesta" },
  { id: 5, id_marca: 1, nombre: "Hilux" },
  { id: 6, id_marca: 3, nombre: "Onix" },
  { id: 7, id_marca: 5, nombre: "Logan" },
  { id: 8, id_marca: 5, nombre: "Duster" },
];

export const tiposVehiculo = [
  { id: 1, nombre: "Automóvil" },
  { id: 2, nombre: "Camioneta" },
  { id: 3, nombre: "Motocicleta" },
  { id: 4, nombre: "Camión" },
];

export function getClienteNombre(id) {
  return clientes.find((cliente) => cliente.id === Number(id))?.nombre || "—";
}

export function getUsuarioNombre(id) {
  return getClienteNombre(id);
}

export function getMarcaNombre(id) {
  return marcas.find((m) => m.id === Number(id))?.nombre || "—";
}

export function getModeloNombre(id) {
  return modelos.find((m) => m.id === Number(id))?.nombre || "—";
}

export function getTipoVehiculoNombre(id) {
  return tiposVehiculo.find((t) => t.id === Number(id))?.nombre || "—";
}

export const estadoLabel = {
  activo: "Activo",
  en_servicio: "En Servicio",
  inactivo: "Inactivo",
  anulado: "Anulado",
};

export const estadoClass = {
  activo: "bg-success/10 text-success",
  en_servicio: "bg-warning/10 text-warning",
  inactivo: "bg-muted text-muted-foreground",
  anulado: "bg-muted text-muted-foreground",
};
