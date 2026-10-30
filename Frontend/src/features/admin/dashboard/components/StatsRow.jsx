import { getPeriodSummary, getPeriodoLabel, stats } from "../services/dashboardData";

export function StatsRow({ periodo }) {
  const resumen = getPeriodSummary(periodo);
  const etiquetaPeriodo = getPeriodoLabel(periodo);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div key={stat.name} className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-semibold mt-2">
                  {stat.metric === "ventas"
                    ? `$${resumen[stat.metric].toLocaleString("en-US")}`
                    : resumen[stat.metric].toLocaleString("en-US")}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{etiquetaPeriodo}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
