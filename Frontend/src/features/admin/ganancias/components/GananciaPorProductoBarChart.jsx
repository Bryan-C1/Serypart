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
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="nombre" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
            formatter={(value) => [`$${value.toFixed(2)}`, "Ganancia"]}
          />
          <Legend />
          <Bar dataKey="gananciaPotencial" fill="#123B5D" name="Ganancia Potencial" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
