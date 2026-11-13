import { TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { etiquetasPeriodo } from "../services/gananciasData";

export function VentasTrendLineChart({ datosGrafica, periodoSeleccionado }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm lg:col-span-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Tendencia de Ventas y Ganancias</h2>
          <p className="text-sm text-muted-foreground">{etiquetasPeriodo[periodoSeleccionado]} — ventas, costos y ganancias</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={datosGrafica}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="etiqueta" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
          <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }}
            formatter={(value) => `$${value.toFixed(2)}`}
          />
          <Legend wrapperStyle={{ color: "var(--text)" }} />
          <Line type="monotone" dataKey="ventas" stroke="var(--primary)" strokeWidth={2} name="Ventas" />
          <Line type="monotone" dataKey="costos" stroke="var(--danger)" strokeWidth={2} name="Costos" />
          <Line type="monotone" dataKey="ganancia" stroke="var(--success)" strokeWidth={2} name="Ganancia" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
