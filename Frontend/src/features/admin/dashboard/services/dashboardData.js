import { Users, Car, Wrench, DollarSign } from "lucide-react";

export const stats = [
  { name: "Total Clientes", value: "1,234", change: "+12%", trend: "up", icon: Users, color: "bg-blue-500" },
  { name: "Vehículos Registrados", value: "2,156", change: "+8%", trend: "up", icon: Car, color: "bg-green-500" },
  { name: "Servicios Activos", value: "42", change: "-3%", trend: "down", icon: Wrench, color: "bg-primary" },
  { name: "Ventas del Mes", value: "$45,231", change: "+15%", trend: "up", icon: DollarSign, color: "bg-yellow-500" },
];

export const salesData = [
  { month: "Ene", ventas: 12000 },
  { month: "Feb", ventas: 19000 },
  { month: "Mar", ventas: 15000 },
  { month: "Abr", ventas: 25000 },
  { month: "May", ventas: 22000 },
  { month: "Jun", ventas: 30000 },
];

export const servicesData = [
  { name: "Cambio de Aceite", value: 45 },
  { name: "Frenos", value: 30 },
  { name: "Alineación", value: 15 },
  { name: "Otros", value: 10 },
];

export const COLORS = ["#123B5D", "#2563EB", "#16A34A", "#F59E0B"];

export const recentActivity = [
  { id: 1, type: "Cita Programada", client: "Juan Pérez", time: "Hace 5 min", status: "pending" },
  { id: 2, type: "Servicio Completado", client: "María García", time: "Hace 15 min", status: "completed" },
  { id: 3, type: "Nuevo Cliente", client: "Carlos Rodríguez", time: "Hace 1 hora", status: "new" },
  { id: 4, type: "Pago Recibido", client: "Ana Martínez", time: "Hace 2 horas", status: "paid" },
];

export const upcomingAppointments = [
  { client: "Pedro López", service: "Mantenimiento", time: "10:00 AM" },
  { client: "Laura Sánchez", service: "Revisión de Frenos", time: "11:30 AM" },
  { client: "Miguel Torres", service: "Cambio de Aceite", time: "2:00 PM" },
  { client: "Sofia Ramírez", service: "Alineación", time: "4:00 PM" },
];

export const inventoryAlerts = [
  { part: "Filtro de Aceite Premium", stock: 5, min: 10 },
  { part: "Pastillas de Freno Delanteras", stock: 3, min: 8 },
  { part: "Aceite Motor 10W-40", stock: 7, min: 15 },
];
