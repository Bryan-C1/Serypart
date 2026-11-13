export const initialMecanicos = [
  { id: 1, nombre: "Pedro", apellido: "Álvarez", tipoDocumento: "V", numeroDocumento: "10203040", direccion: "Cra 43 # 12-34", email: "pedro@serypart.com", telefono: "+58 412-1112233", cedula: "V-10203040", especialidad: "Motor", departamento: "Antioquia", ciudad: "Medellín", regionAntioquia: "Valle de Aburrá", calificacion: 4.8, estado: "activo", notas: "Especialista certificado en motores Toyota y Honda." },
  { id: 2, nombre: "Luis", apellido: "Fernández", tipoDocumento: "V", numeroDocumento: "20304050", direccion: "Cr 70 # 25-15", email: "luis@serypart.com", telefono: "+58 424-4445566", cedula: "V-20304050", especialidad: "Electricidad", departamento: "Antioquia", ciudad: "Envigado", regionAntioquia: "Sur", calificacion: 4.5, estado: "activo", notas: "" },
  { id: 3, nombre: "Ramón", apellido: "Torres", tipoDocumento: "V", numeroDocumento: "30405060", direccion: "Av 80 # 50-20", email: "ramon@serypart.com", telefono: "+58 414-7778899", cedula: "V-30405060", especialidad: "Frenos", departamento: "Antioquia", ciudad: "Bello", regionAntioquia: "Norte", calificacion: 4.9, estado: "activo", notas: "Jefe de taller con mayor antigüedad." },
  { id: 4, nombre: "Miguel", apellido: "Castillo", tipoDocumento: "V", numeroDocumento: "40506070", direccion: "Calle 6 # 18-90", email: "miguel@serypart.com", telefono: "+58 426-0001122", cedula: "V-40506070", especialidad: "Suspensión", departamento: "Antioquia", ciudad: "Rionegro", regionAntioquia: "Oriente", calificacion: 4.2, estado: "vacaciones", notas: "" },
  { id: 5, nombre: "Andrés", apellido: "Morales", tipoDocumento: "V", numeroDocumento: "50607080", direccion: "Transversal 31 # 44-55", email: "andres@serypart.com", telefono: "+58 412-3334455", cedula: "V-50607080", especialidad: "Carrocería", departamento: "Antioquia", ciudad: "Medellín", regionAntioquia: "Occidente", calificacion: 4.6, estado: "inactivo", notas: "En proceso de recontratación." },
];

export const especialidades = ["Motor", "Transmisión", "Frenos", "Electricidad", "Suspensión", "Carrocería", "General"];
export const DEPARTAMENTOS_COLOMBIA = ["Antioquia", "Bogotá D.C.", "Valle del Cauca", "Caldas", "Risaralda"];
export const CIUDADES_ANTIOQUIA = ["Medellín", "Envigado", "Itagüí", "Bello", "Rionegro", "Apartadó", "Turbo", "Chigorodó"];
export const REGIONES_ANTIOQUIA = ["Valle de Aburrá", "Norte", "Occidente", "Oriente", "Sur", "Suroeste", "Nordeste", "Bajo Cauca", "Magdalena Medio"];

export const emptyForm = {
  nombre: "", apellido: "", tipoDocumento: "V", numeroDocumento: "", direccion: "", email: "", telefono: "", estado: "activo", cedula: "", especialidad: "General",
  departamento: "Antioquia", ciudad: "Medellín", regionAntioquia: "Valle de Aburrá", calificacion: 5.0, notas: "",
};

export const estadoConfig = {
  activo: { label: "Activo", cls: "bg-success/10 text-success" },
  inactivo: { label: "Inactivo", cls: "bg-muted text-muted-foreground" },
  vacaciones: { label: "Vacaciones", cls: "bg-warning/10 text-warning" },
  anulado: { label: "Anulado", cls: "bg-destructive/10 text-destructive" },
};
