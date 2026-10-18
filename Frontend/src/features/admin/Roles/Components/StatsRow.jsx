import { ShieldCheck, ShieldEllipsis, ShieldOff, Users } from "lucide-react";

export function StatsRow({ stats }) {
  const items = [
    { label: "Total Roles", value: stats.total, icon: ShieldEllipsis, color: "bg-blue-500" },
    { label: "Roles Activos", value: stats.activos, icon: ShieldCheck, color: "bg-success" },
    { label: "Roles Inactivos", value: stats.inactivos, icon: ShieldOff, color: "bg-muted-foreground" },
    { label: "Usuarios Asignados", value: stats.usuarios, icon: Users, color: "bg-primary" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {items.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
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
