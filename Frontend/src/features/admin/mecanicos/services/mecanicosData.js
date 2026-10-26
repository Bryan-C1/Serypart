export const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const HORARIO_MANANA = { value: "manana", label: "8:00 AM a 12:00 PM" };
const HORARIO_MEDIODIA_SEMANA = { value: "mediodia12a1", label: "12:00 PM a 1:00 PM" };
const HORARIO_MEDIODIA_SABADO = { value: "mediodia12a2", label: "12:00 PM a 2:00 PM" };
const HORARIO_TARDE = { value: "tarde", label: "2:00 PM a 5:00 PM" };

export const HORARIOS_POR_DIA = {
  Lunes: [HORARIO_MANANA, HORARIO_MEDIODIA_SEMANA, HORARIO_TARDE],
  Martes: [HORARIO_MANANA, HORARIO_MEDIODIA_SEMANA, HORARIO_TARDE],
  Miércoles: [HORARIO_MANANA, HORARIO_MEDIODIA_SEMANA, HORARIO_TARDE],
  Jueves: [HORARIO_MANANA, HORARIO_MEDIODIA_SEMANA, HORARIO_TARDE],
  Viernes: [HORARIO_MANANA, HORARIO_MEDIODIA_SEMANA, HORARIO_TARDE],
  Sábado: [HORARIO_MANANA, HORARIO_MEDIODIA_SABADO],
};

export function normalizeHorariosPorDia(value) {
  if (!value) return {};

  if (typeof value === "object" && !Array.isArray(value)) {
    return Object.fromEntries(
      DIAS_SEMANA
        .filter((day) => Array.isArray(value[day]))
        .map((day) => [
          day,
          [...new Set(value[day].flatMap((slot) => {
            if (slot === "manana8a10" || slot === "manana10a12") {
              return [HORARIO_MANANA.value];
            }
            if (slot === "mediodia") {
              return [day === "Sábado" ? HORARIO_MEDIODIA_SABADO.value : HORARIO_MEDIODIA_SEMANA.value];
            }
            if (["tarde2a3", "tarde3a4", "tarde4a5"].includes(slot) && day !== "Sábado") {
              return [HORARIO_TARDE.value];
            }
            return HORARIOS_POR_DIA[day].some((option) => option.value === slot) ? [slot] : [];
          }))],
        ])
        .filter(([, slots]) => slots.length > 0)
    );
  }

  return {};
}

export function formatHorariosPorDia(value) {
  const horarios = normalizeHorariosPorDia(value);
  const entries = Object.entries(horarios).filter(([, slots]) => slots.length > 0);

  if (entries.length === 0) return "";

  return entries
    .map(([day, slots]) => `${day}: ${slots.map((slot) => HORARIOS_POR_DIA[day]?.find((option) => option.value === slot)?.label || slot).join(", ")}`)
    .join(" | ");
}

export function getHorariosOcupadosPorDia(mecanicos = [], currentMecanicoId = null) {
  const ocupados = {};

  DIAS_SEMANA.forEach((dia) => {
    ocupados[dia] = new Set();
  });

  mecanicos
    .filter((mecanico) => mecanico.id !== currentMecanicoId && mecanico.estado !== "anulado")
    .forEach((mecanico) => {
      const horarios = normalizeHorariosPorDia(mecanico.horariosPorDia ?? mecanico.horarioDisponibilidad);
      DIAS_SEMANA.forEach((dia) => {
        const slots = horarios[dia] || [];
        slots.forEach((slot) => ocupados[dia].add(slot));
      });
    });

  return ocupados;
}

export const initialMecanicos = [
  { id: 1, nombre: "Pedro", apellido: "Álvarez", tipoDocumento: "V", numeroDocumento: "10203040", direccion: "", email: "pedro@serypart.com", telefono: "+58 412-1112233", cedula: "V-10203040", especialidad: "Motor", horarioDisponibilidad: "Lunes: 8:00 AM a 12:00 PM | Miércoles: 2:00 PM a 5:00 PM", horariosPorDia: { Lunes: ["manana"], Miércoles: ["tarde"] }, calificacion: 4.8, estado: "activo", notas: "Especialista certificado en motores Toyota y Honda." },
  { id: 2, nombre: "Luis", apellido: "Fernández", tipoDocumento: "V", numeroDocumento: "20304050", direccion: "", email: "luis@serypart.com", telefono: "+58 424-4445566", cedula: "V-20304050", especialidad: "Electricidad", horarioDisponibilidad: "Martes: 2:00 PM a 5:00 PM | Viernes: 8:00 AM a 12:00 PM", horariosPorDia: { Martes: ["tarde"], Viernes: ["manana"] }, calificacion: 4.5, estado: "activo", notas: "" },
  { id: 3, nombre: "Ramón", apellido: "Torres", tipoDocumento: "V", numeroDocumento: "30405060", direccion: "", email: "ramon@serypart.com", telefono: "+58 414-7778899", cedula: "V-30405060", especialidad: "Frenos", horarioDisponibilidad: "Jueves: 8:00 AM a 12:00 PM", horariosPorDia: { Jueves: ["manana"] }, calificacion: 4.9, estado: "activo", notas: "Jefe de taller con mayor antigüedad." },
  { id: 4, nombre: "Miguel", apellido: "Castillo", tipoDocumento: "V", numeroDocumento: "40506070", direccion: "", email: "miguel@serypart.com", telefono: "+58 426-0001122", cedula: "V-40506070", especialidad: "Suspensión", horarioDisponibilidad: "Sábado: 8:00 AM a 12:00 PM", horariosPorDia: { Sábado: ["manana"] }, calificacion: 4.2, estado: "vacaciones", notas: "" },
  { id: 5, nombre: "Andrés", apellido: "Morales", tipoDocumento: "V", numeroDocumento: "50607080", direccion: "", email: "andres@serypart.com", telefono: "+58 412-3334455", cedula: "V-50607080", especialidad: "Carrocería", horarioDisponibilidad: "Lunes: 2:00 PM a 5:00 PM", horariosPorDia: { Lunes: ["tarde"] }, calificacion: 4.6, estado: "inactivo", notas: "En proceso de recontratación." },
];

export const especialidades = ["Motor", "Transmisión", "Frenos", "Electricidad", "Suspensión", "Carrocería", "General"];
export const emptyForm = {
  nombre: "", apellido: "", tipoDocumento: "V", numeroDocumento: "", direccion: "", email: "", telefono: "", estado: "activo", cedula: "", especialidad: "General", horarioDisponibilidad: "", horariosPorDia: {},
  calificacion: 5.0, notas: "",
};

export const estadoConfig = {
  activo: { label: "Activo", cls: "bg-success/10 text-success" },
  inactivo: { label: "Inactivo", cls: "bg-muted text-muted-foreground" },
  vacaciones: { label: "Vacaciones", cls: "bg-warning/10 text-warning" },
  anulado: { label: "Anulado", cls: "bg-destructive/10 text-destructive" },
};
