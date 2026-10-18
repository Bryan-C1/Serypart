import { ShoppingCart, TrendingUp, Clock, DollarSign } from "lucide-react";

export function StatsRow({ stats }) {
  const items = [
    { label: "Total Ventas", value: stats.total, icon: ShoppingCart, color: "bg-blue-500", fmt: (v) => String(v) },
    { label: "Pagadas", value: stats.pagadas, icon: TrendingUp, color: "bg-success", fmt: (v) => String(v) },
    { label: "Pendientes / Crédito", value: stats.pendientes, icon: Clock, color: "bg-warning", fmt: (v) => String(v) },
    { label: "Ingresos Cobrados", value: stats.ingresos, icon: DollarSign, color: "bg-primary", fmt: (v) => `$${v.toLocaleString()}` },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {items.map((s, i) => (
        <div key={i} className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`${s.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
              <s.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-semibold">{s.fmt(s.value)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
