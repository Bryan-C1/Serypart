import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, TrendingUp } from "lucide-react";
import { StatsRow } from "../components/StatsRow";
import { SalesBarChart } from "../components/SalesBarChart";
import { ServicesPieChart } from "../components/ServicesPieChart";
import { RecentActivityList } from "../components/RecentActivityList";
import { UpcomingAppointmentsCard } from "../components/UpcomingAppointmentsCard";
import { InventoryAlertsGrid } from "../components/InventoryAlertsGrid";

export default function DashboardPage() {
  const [periodo, setPeriodo] = useState("6");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Bienvenido al sistema de gestión SeryPart</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Período</span>
            <select
              aria-label="Filtrar dashboard por período"
              value={periodo}
              onChange={(event) => setPeriodo(event.target.value)}
              className="bg-transparent text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded"
            >
              <option value="3">Últimos 3 meses</option>
              <option value="6">Últimos 6 meses</option>
              <option value="todos">Todo el período</option>
            </select>
          </label>
          <Link
            to="/ganancias"
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            Ganancias
          </Link>
        </div>
      </div>

      <StatsRow periodo={periodo} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesBarChart periodo={periodo} />
        <ServicesPieChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivityList />
        <UpcomingAppointmentsCard />
      </div>

      <InventoryAlertsGrid />
    </div>
  );
}
