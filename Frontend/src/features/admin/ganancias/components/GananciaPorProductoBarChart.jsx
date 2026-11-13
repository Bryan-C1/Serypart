import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function GananciaPorProductoBarChart({ gananciasPorProducto }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold">Ganancia Potencial por Producto</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={gananciasPorProducto}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="nombre" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
          <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }}
            formatter={(value) => [`$${value.toFixed(2)}`, "Ganancia"]}
          />
          <Legend wrapperStyle={{ color: "var(--text)" }} />
          <Bar dataKey="gananciaPotencial" fill="var(--primary)" name="Ganancia Potencial" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
