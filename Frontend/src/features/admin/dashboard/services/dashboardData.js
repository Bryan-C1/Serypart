import { Users, Car, Wrench, DollarSign } from "lucide-react";

export const stats = [
  { name: "Clientes del período", metric: "clientes", icon: Users, color: "bg-blue-500" },
  { name: "Vehículos del período", metric: "vehiculos", icon: Car, color: "bg-green-500" },
  { name: "Servicios del período", metric: "servicios", icon: Wrench, color: "bg-primary" },
  { name: "Ventas del período", metric: "ventas", icon: DollarSign, color: "bg-warning" },
];

export const salesData = [
  { month: "Ene", clientes: 18, vehiculos: 24, servicios: 32, ventas: 12000 },
  { month: "Feb", clientes: 22, vehiculos: 31, servicios: 41, ventas: 19000 },
  { month: "Mar", clientes: 19, vehiculos: 27, servicios: 36, ventas: 15000 },
  { month: "Abr", clientes: 26, vehiculos: 35, servicios: 48, ventas: 25000 },
  { month: "May", clientes: 24, vehiculos: 33, servicios: 44, ventas: 22000 },
  { month: "Jun", clientes: 30, vehiculos: 40, servicios: 55, ventas: 30000 },
];

export function getDashboardPeriodData(periodo) {
  return periodo === "todos" ? salesData : salesData.slice(-Number(periodo));
}

export function getSalesByPeriod(periodo) {
  return getDashboardPeriodData(periodo);
}

export function getPeriodSummary(periodo) {
  return getDashboardPeriodData(periodo).reduce(
    (summary, month) => ({
      clientes: summary.clientes + month.clientes,
      vehiculos: summary.vehiculos + month.vehiculos,
      servicios: summary.servicios + month.servicios,
      ventas: summary.ventas + month.ventas,
    }),
    { clientes: 0, vehiculos: 0, servicios: 0, ventas: 0 }
  );
}

const servicesByMonth = [
  { month: "Ene", values: [12, 9, 6, 5] },
  { month: "Feb", values: [15, 12, 8, 6] },
  { month: "Mar", values: [13, 10, 7, 6] },
  { month: "Abr", values: [18, 14, 9, 7] },
  { month: "May", values: [16, 13, 8, 7] },
  { month: "Jun", values: [20, 16, 11, 8] },
];

const serviceNames = ["Cambio de Aceite", "Frenos", "Alineación", "Otros"];

export function getServicesByPeriod(periodo) {
  const months = new Set(getDashboardPeriodData(periodo).map(({ month }) => month));
  return serviceNames.map((name, index) => ({
    name,
    value: servicesByMonth
      .filter(({ month }) => months.has(month))
      .reduce((total, month) => total + month.values[index], 0),
  }));
}

export function getRecentActivityByPeriod(periodo) {
  const months = new Set(getDashboardPeriodData(periodo).map(({ month }) => month));
  return recentActivity.filter((activity) => months.has(activity.month));
}

export function getPeriodoLabel(periodo) {
  return periodo === "todos" ? "Todo el período" : `Últimos ${periodo} meses`;
}

export const COLORS = ["var(--primary)", "var(--success)", "var(--danger)", "var(--text-muted)"];

export const recentActivity = [
  { id: 1, month: "Jun", type: "Cita Programada", client: "Juan Pérez", status: "pending" },
  { id: 2, month: "May", type: "Servicio Completado", client: "María García", status: "completed" },
  { id: 3, month: "Abr", type: "Nuevo Cliente", client: "Carlos Rodríguez", status: "new" },
  { id: 4, month: "Mar", type: "Pago Recibido", client: "Ana Martínez", status: "paid" },
];

export const upcomingAppointments = [
  { client: "Pedro López", service: "Mantenimiento", time: "10:00 AM", monthsAhead: 1 },
  { client: "Laura Sánchez", service: "Revisión de Frenos", time: "11:30 AM", monthsAhead: 2 },
  { client: "Miguel Torres", service: "Cambio de Aceite", time: "2:00 PM", monthsAhead: 4 },
  { client: "Sofia Ramírez", service: "Alineación", time: "4:00 PM", monthsAhead: 6 },
];

export const inventoryAlerts = [
  { part: "Filtro de Aceite Premium", stock: 5, min: 10 },
  { part: "Pastillas de Freno Delanteras", stock: 3, min: 8 },
  { part: "Aceite Motor 10W-40", stock: 7, min: 15 },
];
