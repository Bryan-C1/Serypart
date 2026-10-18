import { AlertTriangle } from "lucide-react";

export function LowStockAlertBanner({ lowStockCount }) {
  if (lowStockCount === 0) return null;

  return (
    <div className="bg-warning/10 border border-warning/50 rounded-lg p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-semibold text-warning mb-1">Alerta de Inventario</h3>
        <p className="text-sm">Hay {lowStockCount} repuestos con stock bajo o agotado que requieren reabastecimiento.</p>
      </div>
    </div>
  );
}
