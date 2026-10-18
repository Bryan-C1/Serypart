import { Package } from "lucide-react";
import { inventoryAlerts } from "../services/dashboardData";

export function InventoryAlertsGrid() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h3 className="font-semibold mb-4">Alertas de Inventario</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {inventoryAlerts.map((item, index) => (
          <div key={index} className="p-4 border border-warning/50 bg-warning/10 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">{item.part}</p>
                <p className="text-xs text-muted-foreground mt-1">Stock actual: {item.stock}</p>
                <p className="text-xs text-muted-foreground">Mínimo: {item.min}</p>
              </div>
              <Package className="w-5 h-5 text-warning" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
