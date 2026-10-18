import { TrendingUp } from "lucide-react";
import { etiquetasPeriodo } from "../services/gananciasData";

export function SummaryBanner({ periodoSeleccionado, totales, ventasDelPeriodo }) {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Resumen — {etiquetasPeriodo[periodoSeleccionado]}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Ganancia acumulada en el período: <strong className="text-success">${totales.gananciaTotal.toFixed(2)}</strong>.
            Ventas totales: <strong>${ventasDelPeriodo.toFixed(2)}</strong> con un margen neto del <strong className="text-primary">{totales.margenPromedio.toFixed(1)}%</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Producto más rentable:</p>
              <p className="font-medium">{totales.mejorProducto.nombreCompleto}</p>
              <p className="text-sm text-success">${totales.mejorProducto.gananciaPotencial.toFixed(2)}</p>
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Margen promedio:</p>
              <p className="font-medium text-2xl text-primary">{totales.margenPromedio.toFixed(1)}%</p>
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Total de productos:</p>
              <p className="font-medium text-2xl">{totales.productos}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
