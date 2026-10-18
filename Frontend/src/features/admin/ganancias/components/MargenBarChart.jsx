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
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="nombre" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} label={{ value: "%", angle: -90, position: "insideLeft" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
            formatter={(value) => [`${value.toFixed(1)}%`, "Margen"]}
          />
          <Legend />
          <Bar dataKey="margen" fill="#059669" name="Margen de Ganancia (%)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
