import { Wrench, DollarSign, Clock } from "lucide-react";

export function StatsRow({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Servicios</p>
            <p className="text-2xl font-semibold">{stats.total}</p>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-success w-12 h-12 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Precio Promedio</p>
            <p className="text-2xl font-semibold">${stats.precioPromedio.toFixed(0)}</p>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Servicios Activos</p>
            <p className="text-2xl font-semibold">{stats.activos}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
