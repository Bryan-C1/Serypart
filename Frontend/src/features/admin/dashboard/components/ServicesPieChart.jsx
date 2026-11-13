import { useId, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getServicesByPeriod, getPeriodoLabel } from "../services/dashboardData";

const PASTEL_COLORS = ["#60A5FA", "#6DD5AE", "#F48FA8", "#F5C96B"];

export function ServicesPieChart({ periodo }) {
  const [limite, setLimite] = useState("todos");
  const gradientPrefix = useId().replace(/:/g, "");
  const datosOrdenados = getServicesByPeriod(periodo).sort((a, b) => b.value - a.value);
  const datosFiltrados = limite === "todos" ? datosOrdenados : datosOrdenados.slice(0, Number(limite));

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-semibold">Servicios Más Solicitados</h3>
          <p className="text-xs text-muted-foreground mt-1">{getPeriodoLabel(periodo)}</p>
        </div>
        <select
          aria-label="Filtrar servicios por cantidad"
          value={limite}
          onChange={(event) => setLimite(event.target.value)}
          className="px-3 py-2 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="todos">Todos</option>
          <option value="1">Top 1</option>
          <option value="2">Top 2</option>
          <option value="3">Top 3</option>
        </select>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {PASTEL_COLORS.map((color, index) => (
                <linearGradient
                  key={`shine-${index}`}
                  id={`service-shine-${gradientPrefix}-${index}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={`color-mix(in srgb, ${color} 78%, white)`} />
                  <stop offset="32%" stopColor={color} />
                  <stop offset="100%" stopColor={color} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={datosFiltrados}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent, x, y, textAnchor }) => (
                <text
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                  fill="var(--foreground)"
                  stroke="var(--card)"
                  strokeWidth={3}
                  paintOrder="stroke"
                  fontSize={12}
                  fontWeight={500}
                >
                  {`${name}: ${(percent * 100).toFixed(0)}%`}
                </text>
              )}
              outerRadius={100}
              dataKey="value"
            >
              {datosFiltrados.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#service-shine-${gradientPrefix}-${index % PASTEL_COLORS.length})`}
                  stroke="var(--card)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
