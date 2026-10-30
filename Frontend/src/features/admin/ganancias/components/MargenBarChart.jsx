import { DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function MargenBarChart({ gananciasPorProducto }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm lg:col-span-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold">Margen de Ganancia por Producto</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={gananciasPorProducto}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="nombre" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
          <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} label={{ value: "%", angle: -90, position: "insideLeft", fill: "var(--text-muted)" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }}
            formatter={(value) => [`${value.toFixed(1)}%`, "Margen"]}
          />
          <Legend wrapperStyle={{ color: "var(--text)" }} />
          <Bar dataKey="margen" fill="var(--success)" name="Margen de Ganancia (%)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
