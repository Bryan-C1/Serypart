export const especialidades = ["Motor", "Transmisión", "Frenos", "Electricidad", "Suspensión", "Carrocería", "General"];
export const emptyForm = {
  nombre: "", apellido: "", tipoDocumento: "V", numeroDocumento: "", direccion: "", email: "", telefono: "", estado: "activo", cedula: "", especialidad: "General", turno: "Completo",
  calificacion: 5.0, notas: "",
};

export const estadoConfig = {
  activo: { label: "Activo", cls: "bg-success/10 text-success" },
  inactivo: { label: "Inactivo", cls: "bg-muted text-muted-foreground" },
  vacaciones: { label: "Vacaciones", cls: "bg-warning/10 text-warning" },
  anulado: { label: "Anulado", cls: "bg-destructive/10 text-destructive" },
};
