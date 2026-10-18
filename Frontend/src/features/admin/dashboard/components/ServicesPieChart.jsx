import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { servicesData, COLORS } from "../services/dashboardData";

export function ServicesPieChart() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h3 className="font-semibold mb-4">Servicios Más Solicitados</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={servicesData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {servicesData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
