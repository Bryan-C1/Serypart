export const initialProveedores = [
  { id_proveedor: 1, nombre_empresa: "AutoParts Venezuela C.A.", nombre_cliente: "Roberto Vivas", nit: "J-12345678-9", telefono: "+58 212-5551234", email: "ventas@autoparts.com.ve", direccion: "Zona Industrial La Yaguara", estado: "activo" },
  { id_proveedor: 2, nombre_empresa: "Lubricantes del Centro S.A.", nombre_cliente: "Ana Ruiz", nit: "J-98765432-1", telefono: "+58 241-4447788", email: "pedidos@lubricentro.com", direccion: "Av. Bolívar Norte, Local 12", estado: "activo" },
  { id_proveedor: 3, nombre_empresa: "ElectroAuto C.A.", nombre_cliente: "Carlos Medina", nit: "J-55667788-3", telefono: "+58 243-3334455", email: "info@electroauto.com.ve", direccion: "Centro Comercial Industrial", estado: "activo" },
  { id_proveedor: 4, nombre_empresa: "HerraVen Tools", nombre_cliente: "Miguel Ríos", nit: "J-33445566-7", telefono: "+58 212-7778899", email: "ventas@herraven.com", direccion: "Av. Principal de Bello Monte", estado: "pendiente" },
  { id_proveedor: 5, nombre_empresa: "Pinturas Autos Express", nombre_cliente: "Luisa Mora", nit: "J-11223344-5", telefono: "+58 414-6667788", email: "luisa@pintautos.com", direccion: "Calle 8, Edif. Comercial", estado: "inactivo" },
];

export const emptyForm = {
  nombre_empresa: "", nombre_cliente: "", nit: "", email: "", telefono: "", direccion: "", estado: "activo",
};

export function getProveedorNombre(id) {
  return initialProveedores.find((p) => p.id_proveedor === Number(id))?.nombre_empresa || "—";
}

export const estadoConfig = {
  activo: { label: "Activo", cls: "bg-success/10 text-success" },
  inactivo: { label: "Inactivo", cls: "bg-muted text-muted-foreground" },
  pendiente: { label: "Pendiente", cls: "bg-warning/10 text-warning" },
  anulado: { label: "Anulado", cls: "bg-destructive/10 text-destructive" },
};
