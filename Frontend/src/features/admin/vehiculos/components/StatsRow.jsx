import { Car } from "lucide-react";

export function StatsRow({ stats }) {
  const items = [
    { label: "Total Vehículos", value: stats.total, color: "bg-blue-500" },
    { label: "En Servicio", value: stats.enServicio, color: "bg-warning" },
    { label: "Activos", value: stats.activos, color: "bg-success" },
    { label: "Inactivos", value: stats.inactivos, color: "bg-muted" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {items.map((stat, i) => (
        <div key={i} className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
