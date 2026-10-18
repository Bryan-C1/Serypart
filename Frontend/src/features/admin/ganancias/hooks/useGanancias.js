import { useState } from "react";
import { repuestos, datosPorPeriodo } from "../services/gananciasData";

export function useGanancias() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mes");

  const datosGrafica = datosPorPeriodo[periodoSeleccionado];

  const gananciasPorProducto = repuestos.map((r) => ({
    nombre: r.nombre.length > 20 ? r.nombre.substring(0, 20) + "..." : r.nombre,
    nombreCompleto: r.nombre,
    gananciaPorUnidad: r.precioVenta - r.precioCompra,
    gananciaPotencial: (r.precioVenta - r.precioCompra) * r.stock,
    margen: ((r.precioVenta - r.precioCompra) / r.precioCompra) * 100,
  }));

  const gananciasPorCategoria = Object.entries(
    repuestos.reduce((acc, r) => {
      const ganancia = (r.precioVenta - r.precioCompra) * r.stock;
      acc[r.categoria] = (acc[r.categoria] || 0) + ganancia;
      return acc;
    }, {})
  ).map(([categoria, ganancia]) => ({ categoria, ganancia }));

  const gananciaDelPeriodo = datosGrafica.reduce((acc, d) => acc + d.ganancia, 0);
  const ventasDelPeriodo = datosGrafica.reduce((acc, d) => acc + d.ventas, 0);
  const margenDelPeriodo = ventasDelPeriodo > 0 ? (gananciaDelPeriodo / ventasDelPeriodo) * 100 : 0;

  const totales = {
    gananciaTotal: gananciaDelPeriodo,
    productos: repuestos.length,
    margenPromedio: margenDelPeriodo,
    mejorProducto: gananciasPorProducto.reduce((max, p) => (p.gananciaPotencial > max.gananciaPotencial ? p : max)),
  };

  return {
    periodoSeleccionado, setPeriodoSeleccionado, datosGrafica,
    gananciasPorProducto, gananciasPorCategoria, ventasDelPeriodo, totales,
  };
}
