import { apiRequest } from "../../../../shared/services/api";

function fromApi(cliente) {
  return {
    ...cliente,
    id: Number(cliente.id_cliente),
    id_cliente: Number(cliente.id_cliente),
    id_usuario: cliente.id_usuario == null ? null : Number(cliente.id_usuario),
    tipoDocumento: cliente.tipo_documento || "",
    numeroDocumento: cliente.numero_documento || "",
    nombre: cliente.nombre || "",
    apellido: cliente.apellido || "",
    email: cliente.email || "",
    telefono: cliente.telefono || "",
    direccion: cliente.direccion || "",
    cedula: [cliente.tipo_documento, cliente.numero_documento].filter(Boolean).join("-"),
    vehiculos: Number(cliente.vehiculos || 0),
    ultimaVisita: cliente.ultima_visita ? String(cliente.ultima_visita).slice(0, 10) : "",
    fechaRegistro: cliente.fecha_registro ? String(cliente.fecha_registro).slice(0, 10) : "",
    estado: cliente.estado || "activo",
  };
}

function toApi(cliente) {
  return {
    nombre: cliente.nombre?.trim(),
    apellido: cliente.apellido?.trim(),
    tipo_documento: cliente.tipoDocumento ?? cliente.tipo_documento,
    numero_documento: cliente.numeroDocumento ?? cliente.numero_documento,
    telefono: cliente.telefono || "",
    direccion: cliente.direccion || "",
    email: cliente.email || "",
    estado: cliente.estado || "activo",
    fecha_registro: cliente.fechaRegistro || cliente.fecha_registro || new Date().toISOString().slice(0, 10),
  };
}

export async function getClientes() {
  const rows = await apiRequest("/clientes");
  if (!Array.isArray(rows)) throw new Error("La API devolvió un formato inválido para los clientes.");
  return rows.map(fromApi);
}

export async function getClientesActivos() {
  const clientes = await getClientes();
  return clientes.filter((cliente) => String(cliente.estado || "").trim().toLowerCase() !== "anulado");
}

export async function createCliente(cliente) {
  const created = await apiRequest("/clientes", {
    method: "POST",
    body: toApi(cliente),
  });
  return fromApi(created);
}

export async function updateCliente(id, cliente) {
  return fromApi(await apiRequest(`/clientes/${id}`, {
    method: "PUT",
    body: toApi(cliente),
  }));
}

export async function deleteCliente(id) {
  await apiRequest(`/clientes/${id}`, { method: "DELETE" });
}
