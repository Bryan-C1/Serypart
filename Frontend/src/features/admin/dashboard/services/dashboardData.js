import { Users, Car, Wrench, DollarSign } from "lucide-react";

export const stats = [
  { name: "Clientes del período", metric: "clientes", icon: Users, color: "bg-blue-500" },
  { name: "Vehículos del período", metric: "vehiculos", icon: Car, color: "bg-green-500" },
  { name: "Servicios del período", metric: "servicios", icon: Wrench, color: "bg-primary" },
  { name: "Ventas del período", metric: "ventas", icon: DollarSign, color: "bg-warning" },
];

export const COLORS = ["var(--primary)", "var(--success)", "var(--danger)", "var(--text-muted)"];

export const inventoryAlerts = [
  { part: "Filtro de Aceite Premium", stock: 5, min: 10 },
  { part: "Pastillas de Freno Delanteras", stock: 3, min: 8 },
  { part: "Aceite Motor 10W-40", stock: 7, min: 15 },
];

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(value) {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12);
  }
  const [year, month, day] = String(value || "").slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day, 12);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getPeriodRange(view, anchorDate) {
  const anchor = parseLocalDate(anchorDate) || new Date();
  let startDate;
  let endDate;

  if (view === "quarter") {
    const startMonth = Math.floor(anchor.getMonth() / 3) * 3;
    startDate = new Date(anchor.getFullYear(), startMonth, 1, 12);
    endDate = new Date(anchor.getFullYear(), startMonth + 3, 0, 12);
  } else if (view === "year") {
    startDate = new Date(anchor.getFullYear(), 0, 1, 12);
    endDate = new Date(anchor.getFullYear(), 11, 31, 12);
  } else {
    startDate = new Date(anchor.getFullYear(), anchor.getMonth(), 1, 12);
    endDate = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0, 12);
  }

  return {
    startDate: formatLocalDate(startDate),
    endDate: formatLocalDate(endDate),
  };
}

export function movePeriodDate(view, anchorDate, amount) {
  const date = parseLocalDate(anchorDate) || new Date();
  if (view === "quarter") date.setMonth(date.getMonth() + amount * 3);
  else if (view === "year") date.setFullYear(date.getFullYear() + amount);
  else date.setMonth(date.getMonth() + amount);
  return date;
}

export function getPeriodoLabel(view, range) {
  const start = parseLocalDate(range.startDate);
  const end = parseLocalDate(range.endDate);
  if (!start || !end) return "";
  if (view === "year") return String(start.getFullYear());
  if (view === "quarter") {
    const quarter = Math.floor(start.getMonth() / 3) + 1;
    return `Trimestre ${quarter} de ${start.getFullYear()}`;
  }
  if (view === "month") {
    return new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(start);
  }
  return `${dateFormatter.format(start)} – ${dateFormatter.format(end)}`;
}

function isInRange(value, range) {
  const date = value instanceof Date ? formatLocalDate(value) : String(value || "").slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
    && date >= range.startDate
    && date <= range.endDate;
}

function getServiceItems(sale) {
  return (sale.items || []).filter((item) => item.tipo === "servicio" || item.id_servicio != null);
}

function getActiveSales(sales, range) {
  return sales.filter((sale) => (
    String(sale.estado || "").toLowerCase() !== "cancelada"
    && isInRange(sale.fecha_venta, range)
  ));
}

export function getPeriodSummary(data, range) {
  const clients = data.clientes.filter((client) => isInRange(client.fechaRegistro || client.fecha_registro, range));
  const vehicles = data.vehiculos.filter((vehicle) => isInRange(vehicle.fecha_registro, range));
  const sales = getActiveSales(data.ventas, range);
  const services = sales.reduce(
    (total, sale) => total + getServiceItems(sale).reduce((sum, item) => sum + Number(item.cantidad || 0), 0),
    0,
  );
  const salesTotal = sales.reduce((total, sale) => total + Number(sale.total || 0), 0);

  return {
    clientes: clients.length,
    vehiculos: vehicles.length,
    servicios: services,
    ventas: salesTotal,
  };
}

function getChartBuckets(view, range) {
  const start = parseLocalDate(range.startDate);
  const end = parseLocalDate(range.endDate);
  const buckets = [];

  if (view === "year") {
    for (let month = 0; month < 12; month += 1) {
      const date = new Date(start.getFullYear(), month, 1, 12);
      buckets.push({
        date: formatLocalDate(date),
        endDate: formatLocalDate(new Date(start.getFullYear(), month + 1, 0, 12)),
        label: new Intl.DateTimeFormat("es-CO", { month: "short" }).format(date),
      });
    }
    return buckets;
  }

  if (view === "quarter") {
    const quarterStartMonth = start.getMonth();
    for (let monthOffset = 0; monthOffset < 3; monthOffset += 1) {
      const date = new Date(start.getFullYear(), quarterStartMonth + monthOffset, 1, 12);
      buckets.push({
        date: formatLocalDate(date),
        endDate: formatLocalDate(new Date(start.getFullYear(), quarterStartMonth + monthOffset + 1, 0, 12)),
        label: new Intl.DateTimeFormat("es-CO", { month: "short" }).format(date),
      });
    }
    return buckets;
  }

  const dayCount = Math.round((end - start) / 86400000) + 1;
  for (let offset = 0; offset < dayCount; offset += 1) {
    const date = new Date(start);
    date.setDate(date.getDate() + offset);
    buckets.push({
      date: formatLocalDate(date),
      endDate: formatLocalDate(date),
      label: String(date.getDate()),
    });
  }
  return buckets;
}

export function getSalesByPeriod(sales, view, range) {
  const buckets = getChartBuckets(view, range);
  return buckets.map((bucket) => ({
    month: bucket.label,
    ventas: getActiveSales(sales, {
      startDate: bucket.date,
      endDate: bucket.endDate,
    }).reduce((total, sale) => total + Number(sale.total || 0), 0),
  }));
}

export function getServicesByPeriod(sales, range) {
  const serviceTotals = new Map();
  getActiveSales(sales, range).forEach((sale) => {
    getServiceItems(sale).forEach((item) => {
      const name = item.nombre || item.nombre_servicio || "Servicio";
      serviceTotals.set(name, (serviceTotals.get(name) || 0) + Number(item.cantidad || 0));
    });
  });
  return [...serviceTotals.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value);
}

function getClientName(client) {
  return [client.nombre, client.apellido].filter(Boolean).join(" ") || "Cliente";
}

export function getRecentActivityByPeriod(data, range) {
  const activity = [];

  data.clientes.forEach((client) => {
    const date = String(client.fechaRegistro || client.fecha_registro || "").slice(0, 10);
    if (!isInRange(date, range)) return;
    activity.push({
      id: `cliente-${client.id_cliente ?? client.id}`,
      date,
      type: "Nuevo Cliente",
      client: getClientName(client),
      status: "new",
    });
  });

  data.vehiculos.forEach((vehicle) => {
    const date = String(vehicle.fecha_registro || "").slice(0, 10);
    if (!isInRange(date, range)) return;
    activity.push({
      id: `vehiculo-${vehicle.id_vehiculo ?? vehicle.id}`,
      date,
      type: "Vehículo Registrado",
      client: vehicle.placa || vehicle.nombre || "Vehículo",
      status: "completed",
    });
  });

  data.citas.forEach((appointment) => {
    const date = String(appointment.fecha_cita || "").slice(0, 10);
    if (!isInRange(date, range) || String(appointment.estado || "").toLowerCase() === "cancelada") return;
    activity.push({
      id: appointment.id_agendamiento ?? appointment.id,
      date,
      type: "Cita Programada",
      client: appointment.nombre_cliente || "Cliente",
      status: String(appointment.estado || "").toLowerCase() === "completada" ? "completed" : "pending",
    });
  });

  getActiveSales(data.ventas, range).forEach((sale) => {
    const paid = String(sale.estado || "").toLowerCase() === "pagada";
    activity.push({
      id: `venta-${sale.id_venta}`,
      date: String(sale.fecha_venta || "").slice(0, 10),
      type: paid ? "Pago Recibido" : "Venta Registrada",
      client: sale.nombre_usuario || "Cliente",
      status: paid ? "paid" : "pending",
    });
  });

  return activity
    .sort((left, right) => right.date.localeCompare(left.date) || String(right.id).localeCompare(String(left.id)))
    .slice(0, 8);
}

export function getUpcomingAppointmentsByPeriod(appointments, range) {
  const today = formatLocalDate(new Date());
  return appointments
    .filter((appointment) => (
      isInRange(appointment.fecha_cita, range)
      && appointment.fecha_cita >= today
      && !["cancelada", "completada"].includes(String(appointment.estado || "").toLowerCase())
    ))
    .sort((left, right) => (
      String(left.fecha_cita).localeCompare(String(right.fecha_cita))
      || String(left.hora_cita || "").localeCompare(String(right.hora_cita || ""))
    ))
    .slice(0, 4)
    .map((appointment) => ({
      ...appointment,
      service: (appointment.servicios || [])
        .map((service) => service.nombre)
        .filter(Boolean)
        .join(", ") || "Servicio",
      time: appointment.hora_cita || "",
      dateLabel: dateFormatter.format(parseLocalDate(appointment.fecha_cita)),
    }));
}
