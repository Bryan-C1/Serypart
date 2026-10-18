import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { salesData } from "../services/dashboardData";

export function SalesBarChart() {
  const [periodo, setPeriodo] = useState("6");
  const datosFiltrados = periodo === "todos" ? salesData : salesData.slice(-Number(periodo));

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="font-semibold">Ventas Mensuales</h3>
        <select
          aria-label="Filtrar ventas por período"
          value={periodo}
          onChange={(event) => setPeriodo(event.target.value)}
          className="px-3 py-2 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="3">Últimos 3 meses</option>
          <option value="6">Últimos 6 meses</option>
          <option value="todos">Todo el período</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datosFiltrados}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
          <Bar dataKey="ventas" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
