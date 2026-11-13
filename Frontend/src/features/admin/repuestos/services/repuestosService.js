import { apiRequest } from "../../../../shared/services/api";

function fromApi(repuesto) {
  return {
    ...repuesto,
    id_repuesto: Number(repuesto.id_repuesto),
    id_marca_repuesto: Number(repuesto.id_marca_repuesto),
    precio_unitario: Number(repuesto.precio_unitario),
    stock: Number(repuesto.stock),
    stock_minimo: Number(repuesto.stock_minimo),
    nombre: repuesto.nombre || "",
    descripcion: repuesto.descripcion || "",
  };
}

function toApi(repuesto) {
  return {
    nombre: repuesto.nombre.trim(),
    descripcion: repuesto.descripcion || "",
    id_marca_repuesto: Number(repuesto.id_marca_repuesto),
    precio_unitario: Number(repuesto.precio_unitario),
    stock: Number(repuesto.stock),
    stock_minimo: Number(repuesto.stock_minimo),
    estado: repuesto.estado,
  };
}

export async function getRepuestos() {
  const rows = await apiRequest("/repuestos");
  if (!Array.isArray(rows)) throw new Error("La API devolvió un formato inválido para los repuestos.");
  return rows.map(fromApi);
}

export async function getMarcasRepuesto() {
  const rows = await apiRequest("/marcas-repuesto");
  if (!Array.isArray(rows)) throw new Error("La API devolvió un formato inválido para las marcas de repuestos.");
  return rows.map((marca) => ({
    id: Number(marca.id_marca_repuesto),
    nombre: marca.nombre || "",
  }));
}

export async function createRepuesto(repuesto) {
  return fromApi(await apiRequest("/repuestos", {
    method: "POST",
    body: toApi(repuesto),
  }));
}

export async function updateRepuesto(id, repuesto) {
  return fromApi(await apiRequest(`/repuestos/${id}`, {
    method: "PUT",
    body: toApi(repuesto),
  }));
}

export async function createMarcaRepuesto(nombre) {
  const marca = await apiRequest("/marcas-repuesto", {
    method: "POST",
    body: { nombre: nombre.trim(), descripcion: "" },
  });
  if (!marca?.id_marca_repuesto) {
    throw new Error("La API no devolvió un identificador válido para la marca.");
  }
  return {
    id: Number(marca.id_marca_repuesto),
    nombre: marca.nombre || nombre.trim(),
  };
}
