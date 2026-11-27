import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { getClientes } from "../../clientes/services/clientesService";
import { getVehiculos } from "../../vehiculos/services/vehiculosService";
import { getCitas } from "../../agendamiento/services/agendamientoService";
import { getVentas } from "../../ventas/services/ventasService";
import { StatsRow } from "../components/StatsRow";
import { SalesBarChart } from "../components/SalesBarChart";
import { ServicesPieChart } from "../components/ServicesPieChart";
import { RecentActivityList } from "../components/RecentActivityList";
import { UpcomingAppointmentsCard } from "../components/UpcomingAppointmentsCard";
import { InventoryAlertsGrid } from "../components/InventoryAlertsGrid";
import {
  getPeriodoLabel,
  getPeriodRange,
  movePeriodDate,
} from "../services/dashboardData";

const periodViews = [
  { value: "month", label: "Mes" },
  { value: "quarter", label: "Trimestre" },
  { value: "year", label: "Año" },
];

export default function DashboardPage() {
  const [view, setView] = useState("month");
  const [periodDate, setPeriodDate] = useState(() => new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const range = useMemo(() => getPeriodRange(view, periodDate), [view, periodDate]);
  const periodLabel = getPeriodoLabel(view, range);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([getClientes(), getVehiculos(), getCitas(), getVentas()])
      .then(([clientes, vehiculos, citas, ventas]) => {
        if (cancelled) return;
        setDashboardData({ clientes, vehiculos, citas, ventas });
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const navigatePeriod = (amount) => {
    setPeriodDate((current) => movePeriodDate(view, current, amount));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Bienvenido al sistema de gestión SeryPart</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-border bg-card p-1" role="group" aria-label="Vista del período">
            {periodViews.map((periodView) => (
              <button
                key={periodView.value}
                type="button"
                aria-pressed={view === periodView.value}
                onClick={() => setView(periodView.value)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  view === periodView.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {periodView.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => navigatePeriod(-1)}
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Período anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-36 px-2 text-center text-sm font-medium capitalize" aria-live="polite">
              {periodLabel}
            </span>
            <button
              type="button"
              onClick={() => navigatePeriod(1)}
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Período siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <Link
            to="/ganancias"
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            Ganancias
          </Link>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <span>{error}</span>
          <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="font-medium underline">
            Reintentar
          </button>
        </div>
      )}

      {loading ? (
        <div role="status" className="rounded-lg border border-border bg-card py-10 text-center text-muted-foreground">
          Cargando datos del dashboard...
        </div>
      ) : dashboardData && (
        <>
          <StatsRow data={dashboardData} range={range} view={view} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SalesBarChart sales={dashboardData.ventas} view={view} range={range} periodLabel={periodLabel} />
            <ServicesPieChart sales={dashboardData.ventas} range={range} periodLabel={periodLabel} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <RecentActivityList data={dashboardData} range={range} periodLabel={periodLabel} />
            <UpcomingAppointmentsCard appointments={dashboardData.citas} range={range} />
          </div>

          <InventoryAlertsGrid />
        </>
      )}
    </div>
  );
}
