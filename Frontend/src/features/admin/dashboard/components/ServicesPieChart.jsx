import { useId, useState } from "react";
import { PieChart, Pie, Cell, Sector, Tooltip, ResponsiveContainer } from "recharts";
import { getServicesByPeriod, COLORS, getPeriodoLabel } from "../services/dashboardData";

const renderTiltedSector = ({ cx, cy, ...sectorProps }) => (
  <g transform={`translate(0 ${cy * 0.22}) scale(1 0.78)`}>
    <Sector cx={cx} cy={cy} {...sectorProps} />
  </g>
);

const renderGlossSector = ({ cx, cy, ...sectorProps }) => (
  <g transform={`translate(0 ${cy * 0.22}) scale(1 0.78)`} pointerEvents="none">
    <Sector cx={cx} cy={cy} {...sectorProps} />
  </g>
);

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
          <option value="3">Top 3</option>
          <option value="2">Top 2</option>
          <option value="1">Top 1</option>
        </select>
      </div>
      <div className="relative h-[300px]">
        <div className="pointer-events-none absolute left-1/2 top-[78%] z-0 h-6 w-40 -translate-x-1/2 rounded-[50%] bg-black/20 blur-xl dark:bg-black/50" />
        <div className="relative z-10 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {COLORS.map((color, index) => (
                  <radialGradient
                    key={`gradient-${index}`}
                    id={`service-gradient-${gradientPrefix}-${index}`}
                    cx="30%"
                    cy="25%"
                    r="85%"
                  >
                    <stop offset="0%" stopColor={`color-mix(in oklch, ${color} 50%, white)`} />
                    <stop offset="35%" stopColor={`oklch(from ${color} l calc(c * 1.2) h)`} />
                    <stop
                      offset="100%"
                      stopColor={`color-mix(in oklch, oklch(from ${color} l calc(c * 1.2) h) 72%, black)`}
                    />
                  </radialGradient>
                ))}
                <radialGradient
                  id={`service-gloss-${gradientPrefix}`}
                  cx="30%"
                  cy="20%"
                  r="75%"
                >
                  <stop offset="0%" stopColor="white" stopOpacity="0.14" />
                  <stop offset="55%" stopColor="white" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
              </defs>
              <Pie
                data={datosFiltrados}
                cx="50%"
                cy="54%"
                outerRadius={100}
                fill="var(--primary)"
                dataKey="value"
                shape={renderTiltedSector}
              >
                {datosFiltrados.map((entry, index) => (
                  <Cell
                    key={`side-cell-${index}`}
                    fill={`color-mix(in oklch, oklch(from ${COLORS[index % COLORS.length]} l calc(c * 1.2) h) 72%, black)`}
                  />
                ))}
              </Pie>
              <Pie
                data={datosFiltrados}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent, x, y, textAnchor }) => {
                  const index = datosFiltrados.findIndex((entry) => entry.name === name);
                  return (
                    <text
                      x={x}
                      y={y}
                      textAnchor={textAnchor}
                      dominantBaseline="central"
                      fill={COLORS[index % COLORS.length]}
                      stroke="var(--card)"
                      strokeWidth={3}
                      paintOrder="stroke"
                      fontSize={12}
                    >
                      {`${name}: ${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
                outerRadius={100}
                fill="var(--primary)"
                dataKey="value"
                shape={renderTiltedSector}
              >
                {datosFiltrados.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#service-gradient-${gradientPrefix}-${index % COLORS.length})`}
                    stroke="white"
                    strokeOpacity={0.35}
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Pie
                data={datosFiltrados}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                shape={renderGlossSector}
                isAnimationActive={false}
              >
                {datosFiltrados.map((entry, index) => (
                  <Cell key={`gloss-cell-${index}`} fill={`url(#service-gloss-${gradientPrefix})`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
