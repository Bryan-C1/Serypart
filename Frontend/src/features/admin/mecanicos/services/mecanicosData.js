export const initialMecanicos = [
  { id: 1, nombre: "Pedro", apellido: "Álvarez", tipoDocumento: "V", numeroDocumento: "10203040", direccion: "", email: "pedro@serypart.com", telefono: "+58 412-1112233", cedula: "V-10203040", especialidad: "Motor", horarioDisponibilidad: "Completo", calificacion: 4.8, estado: "activo", notas: "Especialista certificado en motores Toyota y Honda." },
  { id: 2, nombre: "Luis", apellido: "Fernández", tipoDocumento: "V", numeroDocumento: "20304050", direccion: "", email: "luis@serypart.com", telefono: "+58 424-4445566", cedula: "V-20304050", especialidad: "Electricidad", horarioDisponibilidad: "Mañana", calificacion: 4.5, estado: "activo", notas: "" },
  { id: 3, nombre: "Ramón", apellido: "Torres", tipoDocumento: "V", numeroDocumento: "30405060", direccion: "", email: "ramon@serypart.com", telefono: "+58 414-7778899", cedula: "V-30405060", especialidad: "Frenos", horarioDisponibilidad: "Tarde", calificacion: 4.9, estado: "activo", notas: "Jefe de taller con mayor antigüedad." },
  { id: 4, nombre: "Miguel", apellido: "Castillo", tipoDocumento: "V", numeroDocumento: "40506070", direccion: "", email: "miguel@serypart.com", telefono: "+58 426-0001122", cedula: "V-40506070", especialidad: "Suspensión", horarioDisponibilidad: "Completo", calificacion: 4.2, estado: "vacaciones", notas: "" },
  { id: 5, nombre: "Andrés", apellido: "Morales", tipoDocumento: "V", numeroDocumento: "50607080", direccion: "", email: "andres@serypart.com", telefono: "+58 412-3334455", cedula: "V-50607080", especialidad: "Carrocería", horarioDisponibilidad: "Mañana", calificacion: 4.6, estado: "inactivo", notas: "En proceso de recontratación." },
];

export const especialidades = ["Motor", "Transmisión", "Frenos", "Electricidad", "Suspensión", "Carrocería", "General"];
export const emptyForm = {
  nombre: "", apellido: "", tipoDocumento: "V", numeroDocumento: "", direccion: "", email: "", telefono: "", estado: "activo", cedula: "", especialidad: "General", horarioDisponibilidad: "",
  calificacion: 5.0, notas: "",
};

export const estadoConfig = {
  activo: { label: "Activo", cls: "bg-success/10 text-success" },
  inactivo: { label: "Inactivo", cls: "bg-muted text-muted-foreground" },
  vacaciones: { label: "Vacaciones", cls: "bg-warning/10 text-warning" },
  anulado: { label: "Anulado", cls: "bg-destructive/10 text-destructive" },
};
