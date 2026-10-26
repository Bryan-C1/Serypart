import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getSalesByPeriod } from "../services/dashboardData";

export function SalesBarChart({ periodo }) {
  const datosFiltrados = getSalesByPeriod(periodo);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h3 className="font-semibold mb-4">Ventas Mensuales</h3>
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
