import { AlertTriangle, CalendarCheck } from "lucide-react";

export const notifications = [
  {
    id: 1,
    title: "Nueva cita agendada",
    message: "Carlos Ramírez agendó una cita para hoy a las 10:00.",
    time: "Hace 10 min",
    category: "Taller",
    path: "/agendamiento",
    icon: CalendarCheck,
  },
  {
    id: 2,
    title: "Repuesto con stock bajo",
    message: "Las pastillas de freno tienen pocas unidades disponibles.",
    time: "Hace 1 hora",
    category: "Inventario",
    path: "/repuestos",
    icon: AlertTriangle,
  },
];
