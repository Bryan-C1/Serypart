import { Users, UserCheck, UserX, Car } from "lucide-react";

export function StatsRow({ stats }) {
  const items = [
    { label: "Total Clientes", value: stats.total, icon: Users, color: "bg-blue-500" },
    { label: "Clientes Activos", value: stats.activos, icon: UserCheck, color: "bg-success" },
    { label: "Clientes Inactivos", value: stats.inactivos, icon: UserX, color: "bg-muted-foreground" },
    { label: "Vehículos Registrados", value: stats.vehiculos, icon: Car, color: "bg-primary" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {items.map((stat, index) => (
        <div key={index} className="rounded-lg border border-border bg-card p-3 shadow-sm sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`${stat.color} flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12`}>
              <stat.icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
              <p className="text-xl font-semibold sm:text-2xl">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
