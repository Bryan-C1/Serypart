import { apiRequest } from "../../../../shared/services/api";

let mecanicosCache = [];

function fromApi(mecanico) {
  const tipoDocumento = mecanico.tipo_documento || "V";
  const numeroDocumento = mecanico.numero_documento || "";
  return {
    id: Number(mecanico.id_mecanico ?? mecanico.id),
    nombre: mecanico.nombre || "",
    apellido: mecanico.apellido || "",
    tipoDocumento,
    numeroDocumento,
    cedula: numeroDocumento ? `${tipoDocumento}-${numeroDocumento}` : "",
    direccion: mecanico.direccion || "",
    email: mecanico.email || "",
    telefono: mecanico.telefono || "",
    especialidad: mecanico.especialidad || "General",
    turno: mecanico.turno || "Completo",
    estado: mecanico.estado || "activo",
    notas: mecanico.notas || "",
  };
}

function toApi(mecanico) {
  return {
    nombre: mecanico.nombre,
    apellido: mecanico.apellido,
    tipo_documento: mecanico.tipoDocumento,
    numero_documento: mecanico.numeroDocumento,
    direccion: mecanico.direccion,
    email: mecanico.email,
    telefono: mecanico.telefono,
    especialidad: mecanico.especialidad,
    turno: mecanico.turno,
    estado: mecanico.estado,
    notas: mecanico.notas,
  };
}

export async function getMecanicos() {
  const rows = await apiRequest("/mecanicos");
  if (!Array.isArray(rows)) throw new Error("La API devolvió un formato inválido para los mecánicos.");
  mecanicosCache = rows.map(fromApi);
  return mecanicosCache;
}

export async function createMecanico(mecanico) {
  const created = fromApi(await apiRequest("/mecanicos", {
    method: "POST",
    body: toApi(mecanico),
  }));
  mecanicosCache = [...mecanicosCache, created];
  return created;
}

export async function updateMecanico(id, mecanico) {
  const updated = fromApi(await apiRequest(`/mecanicos/${id}`, {
    method: "PUT",
    body: toApi(mecanico),
  }));
  mecanicosCache = mecanicosCache.map((item) => item.id === Number(id) ? updated : item);
  return updated;
}

export async function deleteMecanico(id) {
  await apiRequest(`/mecanicos/${id}`, { method: "DELETE" });
  mecanicosCache = mecanicosCache.filter((item) => item.id !== Number(id));
}

export function getMecanicoNombre(id) {
  const mecanico = mecanicosCache.find((item) => String(item.id) === String(id));
  return mecanico ? [mecanico.nombre, mecanico.apellido].filter(Boolean).join(" ") : "—";
}
