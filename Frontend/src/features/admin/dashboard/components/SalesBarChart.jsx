import { useId } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getSalesByPeriod } from "../services/dashboardData";
import { CalendarDays } from "lucide-react";

export function SalesBarChart({ periodo, onPeriodoChange }) {
  const datosFiltrados = getSalesByPeriod(periodo);
  const gradientId = `sales-bar-gradient-${useId().replace(/:/g, "")}`;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="font-semibold">Ventas Mensuales</h3>
        <label className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Período</span>
          <select
            aria-label="Filtrar dashboard por período"
            value={periodo}
            onChange={(event) => onPeriodoChange(event.target.value)}
            className="bg-transparent text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            <option value="3">Últimos 3 meses</option>
            <option value="6">Últimos 6 meses</option>
            <option value="todos">Todo el período</option>
          </select>
        </label>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datosFiltrados}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="color-mix(in srgb, var(--primary) 88%, white)" />
              <stop offset="28%" stopColor="color-mix(in srgb, var(--primary) 68%, white)" />
              <stop offset="100%" stopColor="var(--primary)" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
          <Bar dataKey="ventas" fill={`url(#${gradientId})`} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
