import { DollarSign, Package, TrendingUp, BarChart3 } from "lucide-react";

export function StatsRow({ totales }) {
  const items = [
    {
      label: "Ganancia Potencial Total",
      value: `$${totales.gananciaTotal.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-success",
    },
    {
      label: "Total de Productos",
      value: totales.productos,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      label: "Margen Promedio",
      value: `${totales.margenPromedio.toFixed(1)}%`,
      icon: TrendingUp,
      color: "bg-primary",
    },
    {
      label: "Mejor Producto",
      value: totales.mejorProducto.nombreCompleto.substring(0, 12) + "...",
      icon: BarChart3,
      color: "bg-warning",
      title: totales.mejorProducto.nombreCompleto,
    },
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
              <p className="text-xl font-semibold" title={stat.title}>
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
