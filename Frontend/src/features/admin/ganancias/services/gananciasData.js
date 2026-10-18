export const repuestos = [
  { id: 1, nombre: "Filtro de Aceite Premium", codigo: "FLT-001", precioVenta: 12, precioCompra: 8, stock: 25, categoria: "Filtros" },
  { id: 2, nombre: "Pastillas de Freno Delanteras", codigo: "BRK-002", precioVenta: 45, precioCompra: 30, stock: 8, categoria: "Frenos" },
  { id: 3, nombre: "Aceite Motor 10W-40", codigo: "OIL-003", precioVenta: 28, precioCompra: 18, stock: 15, categoria: "Lubricantes" },
  { id: 4, nombre: "Batería 12V 60Ah", codigo: "BAT-004", precioVenta: 95, precioCompra: 65, stock: 5, categoria: "Eléctrico" },
  { id: 5, nombre: "Bujías Platinum", codigo: "SPK-005", precioVenta: 8, precioCompra: 5, stock: 40, categoria: "Motor" },
];

export const datosPorPeriodo = {
  mes: [
    { etiqueta: "Sem 1", ventas: 920, costos: 600, ganancia: 320 },
    { etiqueta: "Sem 2", ventas: 1050, costos: 680, ganancia: 370 },
    { etiqueta: "Sem 3", ventas: 980, costos: 630, ganancia: 350 },
    { etiqueta: "Sem 4", ventas: 850, costos: 490, ganancia: 360 },
  ],
  trimestre: [
    { etiqueta: "Abr", ventas: 3900, costos: 2500, ganancia: 1400 },
    { etiqueta: "May", ventas: 4200, costos: 2700, ganancia: 1500 },
    { etiqueta: "Jun", ventas: 3800, costos: 2400, ganancia: 1400 },
  ],
  año: [
    { etiqueta: "Ene", ventas: 2400, costos: 1600, ganancia: 800 },
    { etiqueta: "Feb", ventas: 3100, costos: 2000, ganancia: 1100 },
    { etiqueta: "Mar", ventas: 2800, costos: 1800, ganancia: 1000 },
    { etiqueta: "Abr", ventas: 3900, costos: 2500, ganancia: 1400 },
    { etiqueta: "May", ventas: 4200, costos: 2700, ganancia: 1500 },
    { etiqueta: "Jun", ventas: 3800, costos: 2400, ganancia: 1400 },
    { etiqueta: "Jul", ventas: 4100, costos: 2600, ganancia: 1500 },
    { etiqueta: "Ago", ventas: 4500, costos: 2900, ganancia: 1600 },
    { etiqueta: "Sep", ventas: 3700, costos: 2300, ganancia: 1400 },
    { etiqueta: "Oct", ventas: 4800, costos: 3100, ganancia: 1700 },
    { etiqueta: "Nov", ventas: 5200, costos: 3300, ganancia: 1900 },
    { etiqueta: "Dic", ventas: 5800, costos: 3700, ganancia: 2100 },
  ],
};

export const etiquetasPeriodo = {
  mes: "Junio 2026 — semanas",
  trimestre: "2º Trimestre 2026",
  año: "Año 2026",
};

export const COLORS = ["#123B5D", "#2563EB", "#059669", "#D97706", "#7C3AED", "#DC2626"];
