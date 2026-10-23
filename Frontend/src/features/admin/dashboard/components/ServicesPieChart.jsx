import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { servicesData, COLORS } from "../services/dashboardData";

export function ServicesPieChart() {
  const [limite, setLimite] = useState("todos");
  const datosOrdenados = [...servicesData].sort((a, b) => b.value - a.value);
  const datosFiltrados = limite === "todos" ? datosOrdenados : datosOrdenados.slice(0, Number(limite));

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="font-semibold">Servicios Más Solicitados</h3>
        <select
          aria-label="Filtrar servicios por cantidad"
          value={limite}
          onChange={(event) => setLimite(event.target.value)}
          className="px-3 py-2 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="todos">Todos</option>
          <option value="3">Top 3</option>
          <option value="2">Top 2</option>
          <option value="1">Top 1</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={datosFiltrados}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {datosFiltrados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
