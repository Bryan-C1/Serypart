import { Package } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { COLORS } from "../services/gananciasData";

export function GananciaPorCategoriaPieChart({ gananciasPorCategoria }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold">Ganancias por Categoría</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={gananciasPorCategoria}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ categoria, percent }) => `${categoria} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="var(--primary)"
            dataKey="ganancia"
          >
            {gananciasPorCategoria.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }}
            formatter={(value) => `$${value.toFixed(2)}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
