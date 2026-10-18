import { Package, AlertTriangle } from "lucide-react";

export function StatsRow({ repuestos, lowStockCount }) {
  const items = [
    { label: "Total Repuestos", value: repuestos.length, color: "bg-blue-500", icon: Package },
    { label: "Valor Inventario", value: "$12,450", color: "bg-success", icon: Package },
    { label: "Stock Bajo", value: lowStockCount, color: "bg-warning", icon: AlertTriangle },
    { label: "Agotados", value: repuestos.filter((r) => r.estado === "agotado").length, color: "bg-destructive", icon: AlertTriangle },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {items.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
