export const initialCompras = [
  { id_compra: 1, id_proveedor: 1, fecha_compra: "2026-05-20", total: 800, estado: "recibida", items: [] },
  { id_compra: 2, id_proveedor: 2, fecha_compra: "2026-05-22", total: 420, estado: "recibida", items: [] },
  { id_compra: 3, id_proveedor: 3, fecha_compra: "2026-05-28", total: 650, estado: "en_transito", items: [] },
  { id_compra: 4, id_proveedor: 4, fecha_compra: "2026-06-01", total: 310, estado: "pendiente", items: [] },
  { id_compra: 5, id_proveedor: 5, fecha_compra: "2026-05-15", total: 180, estado: "cancelada", items: [] },
];

export const emptyForm = {
  id_proveedor: "", fecha_compra: "", total: 0, estado: "pendiente", items: [],
};

export const estadoConfig = {
  recibida: { label: "Recibida", cls: "bg-success/10 text-success" },
  pendiente: { label: "Pendiente", cls: "bg-warning/10 text-warning" },
  en_transito: { label: "En Tránsito", cls: "bg-blue-500/10 text-blue-500" },
  cancelada: { label: "Anulada", cls: "bg-destructive/10 text-destructive" },
};

export const categorias = [];