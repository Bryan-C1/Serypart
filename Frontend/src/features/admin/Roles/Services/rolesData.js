export const MODULOS = [
  { key: "clientes", label: "Clientes" },
  { key: "vehiculos", label: "Vehículos" },
  { key: "servicios", label: "Servicios" },
  { key: "mecanicos", label: "Mecánicos" },
  { key: "agendamiento", label: "Agendamiento" },
  { key: "repuestos", label: "Repuestos" },
  { key: "proveedores", label: "Proveedores" },
  { key: "ventas", label: "Ventas" },
  { key: "compras", label: "Compras" },
  { key: "ganancias", label: "Ganancias" },
  { key: "roles", label: "Roles" },
  { key: "usuarios", label: "Usuarios" },
  { key: "configuracion", label: "Configuración" },
];

export const ACCIONES = [
  { key: "ver", label: "Ver" },
  { key: "crear", label: "Crear" },
  { key: "editar", label: "Editar" },
  { key: "eliminar", label: "Eliminar" },
];

export function permisosVacios() {
  const permisos = {};
  MODULOS.forEach((m) => {
    permisos[m.key] = { ver: false, crear: false, editar: false, eliminar: false };
  });
  return permisos;
}

function permisosCompletos(modulos) {
  const permisos = permisosVacios();
  modulos.forEach((key) => {
    permisos[key] = { ver: true, crear: true, editar: true, eliminar: true };
  });
  return permisos;
}

function permisosSoloVer(modulos) {
  const permisos = permisosVacios();
  modulos.forEach((key) => {
    permisos[key] = { ver: true, crear: false, editar: false, eliminar: false };
  });
  return permisos;
}

export const initialRoles = [
  {
    id: 1,
    nombre: "Administrador",
    descripcion: "Acceso total a todos los módulos del sistema.",
    estado: "activo",
    usuariosAsignados: 2,
    permisos: permisosCompletos(MODULOS.map((m) => m.key)),
  },
  {
    id: 2,
    nombre: "Mecánico",
    descripcion: "Gestiona vehículos y servicios en taller.",
    estado: "activo",
    usuariosAsignados: 5,
    permisos: {
      ...permisosVacios(),
      vehiculos: { ver: true, crear: false, editar: true, eliminar: false },
      servicios: { ver: true, crear: false, editar: false, eliminar: false },
      repuestos: { ver: true, crear: false, editar: false, eliminar: false },
    },
  },
  {
    id: 3,
    nombre: "Recepcionista",
    descripcion: "Atiende clientes, agenda citas y registra vehículos.",
    estado: "activo",
    usuariosAsignados: 3,
    permisos: {
      ...permisosVacios(),
      clientes: { ver: true, crear: true, editar: true, eliminar: false },
      vehiculos: { ver: true, crear: true, editar: true, eliminar: false },
      agendamiento: { ver: true, crear: true, editar: true, eliminar: true },
    },
  },
  {
    id: 4,
    nombre: "Contador",
    descripcion: "Consulta ventas, compras y reportes de ganancias.",
    estado: "activo",
    usuariosAsignados: 1,
    permisos: permisosSoloVer(["ventas", "compras", "ganancias", "proveedores"]),
  },
  {
    id: 5,
    nombre: "Supervisor de Taller",
    descripcion: "Supervisa mecánicos, repuestos y proveedores.",
    estado: "inactivo",
    usuariosAsignados: 0,
    permisos: {
      ...permisosVacios(),
      mecanicos: { ver: true, crear: true, editar: true, eliminar: false },
      repuestos: { ver: true, crear: true, editar: true, eliminar: true },
      proveedores: { ver: true, crear: true, editar: true, eliminar: false },
    },
  },
];

export const emptyForm = {
  nombre: "",
  descripcion: "",
  estado: "activo",
  usuariosAsignados: 0,
  permisos: permisosVacios(),
};

export function getRolNombre(idRol) {
  const rol = initialRoles.find((r) => r.id === Number(idRol));
  return rol ? rol.nombre : "Sin rol";
}

export function contarPermisosActivos(permisos) {
  let count = 0;
  Object.values(permisos || {}).forEach((mod) => {
    Object.values(mod).forEach((v) => { if (v) count++; });
  });
  return count;
}
