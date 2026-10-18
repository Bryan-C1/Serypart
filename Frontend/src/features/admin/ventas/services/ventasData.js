export const initialVentas = [
  { id_venta: 1, id_cliente: 1, fecha_venta: "2026-05-30", total: 120, id_metodo_pago: 2, estado: "pagada", items: [] },
  { id_venta: 2, id_cliente: 2, fecha_venta: "2026-05-28", total: 260, id_metodo_pago: 1, estado: "pagada", items: [] },
  { id_venta: 3, id_cliente: 3, fecha_venta: "2026-05-25", total: 450, id_metodo_pago: 4, estado: "credito", items: [] },
  { id_venta: 4, id_cliente: 4, fecha_venta: "2026-06-01", total: 185, id_metodo_pago: 5, estado: "pendiente", items: [] },
  { id_venta: 5, id_cliente: 5, fecha_venta: "2026-05-20", total: 550, id_metodo_pago: 3, estado: "cancelada", items: [] },
];

export const metodosPago = [
  { id: 1, nombre: "Efectivo" },
  { id: 2, nombre: "Transferencia" },
  { id: 3, nombre: "Tarjeta" },
  { id: 4, nombre: "Crédito" },
  { id: 5, nombre: "Pago Móvil" },
];

export function getMetodoPagoNombre(id) {
  return metodosPago.find((m) => m.id === Number(id))?.nombre || "—";
}

export const emptyForm = {
  id_venta: "", id_cita: "", tieneCita: true, id_cliente: "", fecha_venta: "", total: 0, id_metodo_pago: "", estado: "pendiente", items: [],
};

export const estadoConfig = {
  pagada: { label: "Pagada", cls: "bg-success/10 text-success" },
  pendiente: { label: "Pendiente", cls: "bg-warning/10 text-warning" },
  cancelada: { label: "Cancelada", cls: "bg-destructive/10 text-destructive" },
  credito: { label: "A Crédito", cls: "bg-blue-500/10 text-blue-500" },
};
