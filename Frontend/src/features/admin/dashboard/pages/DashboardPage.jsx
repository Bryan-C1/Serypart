import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { StatsRow } from "../components/StatsRow";
import { SalesBarChart } from "../components/SalesBarChart";
import { ServicesPieChart } from "../components/ServicesPieChart";
import { RecentActivityList } from "../components/RecentActivityList";
import { UpcomingAppointmentsCard } from "../components/UpcomingAppointmentsCard";
import { InventoryAlertsGrid } from "../components/InventoryAlertsGrid";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Bienvenido al sistema de gestión SeryPart</p>
        </div>
        <Link
          to="/ganancias"
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
        >
          <TrendingUp className="w-5 h-5" />
          Ganancias
        </Link>
      </div>

      <StatsRow />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesBarChart />
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
