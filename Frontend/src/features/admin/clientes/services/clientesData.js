export const initialClientes = [
  { id: 1, tipoDocumento: "CC", numeroDocumento: "12345678", nombre: "Juan", apellido: "Pérez", telefono: "584121234567", direccion: "Av. Principal, Caracas", email: "", cedula: "V-12345678", vehiculos: 2, ultimaVisita: "2026-05-28", estado: "activo" },
  { id: 2, tipoDocumento: "CC", numeroDocumento: "98765432", nombre: "María", apellido: "García", telefono: "584249876543", direccion: "Calle 5, Valencia", email: "", cedula: "V-98765432", vehiculos: 1, ultimaVisita: "2026-05-25", estado: "activo" },
  { id: 3, tipoDocumento: "CC", numeroDocumento: "11223344", nombre: "Carlos", apellido: "Rodríguez", telefono: "584145551234", direccion: "Zona Industrial, Maracay", email: "", cedula: "V-11223344", vehiculos: 3, ultimaVisita: "2026-05-20", estado: "activo" },
  { id: 4, tipoDocumento: "CC", numeroDocumento: "55667788", nombre: "Ana", apellido: "Martínez", telefono: "584267778899", direccion: "Urbanización Los Cedros", email: "", cedula: "V-55667788", vehiculos: 1, ultimaVisita: "2026-05-15", estado: "inactivo" },
  { id: 5, tipoDocumento: "CC", numeroDocumento: "33445566", nombre: "Luis", apellido: "Hernández", telefono: "584123334455", direccion: "Av. Libertador, Caracas", email: "", cedula: "V-33445566", vehiculos: 2, ultimaVisita: "2026-04-10", estado: "activo" },
];

export function getClientesGuardados() {
  return initialClientes;
}

export const emptyForm = {
  tipoDocumento: "CC", numeroDocumento: "", nombre: "", apellido: "", telefono: "", direccion: "", estado: "activo",
  email: "", fechaRegistro: "", cedula: "", vehiculos: 0, ultimaVisita: "",
};
