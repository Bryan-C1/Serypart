import { apiRequest } from "../../../../shared/services/api";

function fromApi(venta) {
  const idVenta = Number(venta.id_venta);
  const items = (venta.items || []).map((item) => ({
    ...item,
    id_detalle_venta: Number(item.id_detalle_venta),
    id_venta: idVenta,
    id_repuesto: Number(item.id_repuesto),
    cantidad: Number(item.cantidad),
    precio_unitario: Number(item.precio_unitario),
    subtotal: Number(item.subtotal),
    nombre: item.nombre || item.nombre_repuesto || "",
    tipo: "repuesto",
  }));
  const total = Number(venta.total);
  return {
    ...venta,
    id_venta: idVenta,
    id_cliente: Number(venta.id_cliente),
    id_usuario: venta.id_usuario == null ? null : Number(venta.id_usuario),
    fecha_venta: String(venta.fecha_venta || "").slice(0, 10),
    id_metodo_pago: Number(venta.id_metodo_pago),
    total,
    otherConceptsTotal: Math.max(0, total - items.reduce((sum, item) => sum + item.subtotal, 0)),
    nombre_usuario: [venta.usuario_nombre, venta.usuario_apellido].filter(Boolean).join(" "),
    nombre_metodo_pago: venta.metodo_pago_nombre || "",
    items,
  };
}

function toApi(venta) {
  const items = (venta.items || [])
    .filter((item) => item.id_repuesto)
    .map((item) => ({
      id_repuesto: Number(item.id_repuesto),
      cantidad: Number(item.cantidad),
      precio_unitario: Number(item.precio_unitario),
    }));

  return {
    id_cliente: Number(venta.id_cliente),
    fecha_venta: venta.fecha_venta,
    total: (venta.items || []).reduce((sum, item) => sum + Number(item.subtotal || 0), 0)
      + Number(venta.otherConceptsTotal || 0),
    id_metodo_pago: Number(venta.id_metodo_pago),
    estado: venta.estado,
    items,
  };
}

export async function getVentas() {
  const ventas = await apiRequest("/ventas");
  if (!Array.isArray(ventas)) throw new Error("La API devolvió un formato inválido para las ventas.");
  return ventas.map(fromApi);
}

export async function getMetodosPago() {
  const metodos = await apiRequest("/metodos-pago");
  if (!Array.isArray(metodos)) throw new Error("La API devolvió un formato inválido para los métodos de pago.");
  return metodos.map((metodo) => ({
    id: Number(metodo.id_metodo_pago),
    nombre: metodo.nombre,
  }));
}

export async function createMetodoPago(nombre) {
  const metodo = await apiRequest("/metodos-pago", {
    method: "POST",
    body: { nombre: nombre.trim() },
  });
  if (!metodo?.id_metodo_pago) {
    throw new Error("La API no devolvió un identificador válido para el método de pago.");
  }
  return {
    id: Number(metodo.id_metodo_pago),
    nombre: metodo.nombre,
  };
}

export async function createVenta(venta) {
  return fromApi(await apiRequest("/ventas", { method: "POST", body: toApi(venta) }));
}

export async function updateVenta(id, venta) {
  return fromApi(await apiRequest(`/ventas/${id}`, { method: "PUT", body: toApi(venta) }));
}
