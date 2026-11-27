import { useId } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getSalesByPeriod } from "../services/dashboardData";

export function SalesBarChart({ sales, view, range, periodLabel }) {
  const datosFiltrados = getSalesByPeriod(sales, view, range);
  const gradientId = `sales-bar-gradient-${useId().replace(/:/g, "")}`;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold">Ventas Mensuales</h3>
        <p className="mt-1 text-xs capitalize text-muted-foreground">{periodLabel}</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datosFiltrados}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="28%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" stroke="var(--muted-foreground)" />
          <YAxis
            stroke="var(--muted-foreground)"
            tickFormatter={(value) => Number(value).toLocaleString("es-CO")}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            formatter={(value) => [`$${Number(value).toLocaleString("es-CO")}`, "Ventas"]}
          />
          <Bar dataKey="ventas" fill={`url(#${gradientId})`} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
