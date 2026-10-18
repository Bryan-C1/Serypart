import { ModalWrapper } from "./ModalWrapper";

export function GananciaAnalysisModal({ open, repuesto, onClose }) {
  if (!open || !repuesto) return null;

  const ganancia = repuesto.precioVenta - repuesto.precioCompra;
  const margen = repuesto.precioCompra > 0 ? ((ganancia / repuesto.precioCompra) * 100).toFixed(1) : 0;
  const gananciaPotencial = ganancia * repuesto.stock;

  return (
    <ModalWrapper title="Análisis de Ganancia" onClose={onClose}>
      <div className="space-y-6">
        <div className="text-center p-6 bg-gradient-to-br from-success/10 to-success/5 border border-success/30 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{repuesto.nombre}</h3>
          <p className="text-sm text-muted-foreground">{repuesto.codigo}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">Precio de Compra</p>
            <p className="text-2xl font-semibold text-blue-600">${repuesto.precioCompra.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">Precio de Venta</p>
            <p className="text-2xl font-semibold text-primary">${repuesto.precioVenta.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-success/10 border border-success/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">Ganancia por Unidad</p>
            <p className="text-2xl font-semibold text-success">${ganancia.toFixed(2)}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
            <span className="text-sm font-medium">Margen de Ganancia:</span>
            <span className="font-semibold text-success">{margen}%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
            <span className="text-sm font-medium">Stock Disponible:</span>
            <span className="font-semibold">{repuesto.stock} unidades</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-success/20 border border-success/40 rounded-lg">
            <span className="text-sm font-medium">Ganancia Potencial Total:</span>
            <span className="font-semibold text-success">${gananciaPotencial.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-4 bg-muted/30 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">Nota:</p>
          <p className="text-sm">
            La ganancia potencial total se calcula multiplicando la ganancia por unidad
            (${ganancia.toFixed(2)})
            por el stock disponible ({repuesto.stock} unidades).
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
        <button onClick={onClose} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
          Cerrar
        </button>
      </div>
    </ModalWrapper>
  );
}
