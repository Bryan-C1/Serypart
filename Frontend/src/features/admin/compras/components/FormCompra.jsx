import { useState } from "react";
import { X } from "lucide-react";
import { initialProveedores } from "../../proveedores/services/proveedoresData";
import { initialRepuestos } from "../../repuestos/services/repuestosData";
import { SearchableSelect } from "../../../../shared/ui/searchable-select";

const inputCls = "w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring";

export function FormCompra({ formData, setFormData }) {
  const [repuestoActual, setRepuestoActual] = useState("");
  const [cantidadActual, setCantidadActual] = useState(1);

  const field = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: key === "id_proveedor" || key === "total" ? Number(e.target.value) : e.target.value }));

  const items = formData.items || [];

  const handleAgregarItem = () => {
    if (!repuestoActual || cantidadActual <= 0) return;
    const repuesto = initialRepuestos.find((r) => String(r.id_repuesto) === String(repuestoActual));
    if (!repuesto) return;
    if (items.some((it) => it.id_repuesto === repuesto.id_repuesto)) return;
    setFormData((prev) => ({
      ...prev,
      items: [...(prev.items || []), { id_repuesto: repuesto.id_repuesto, nombre: repuesto.nombre, cantidad: Number(cantidadActual), costo_unitario: repuesto.precio_unitario }],
    }));
    setRepuestoActual("");
    setCantidadActual(1);
  };

  const handleQuitarItem = (id_repuesto) => {
    setFormData((prev) => ({ ...prev, items: (prev.items || []).filter((it) => it.id_repuesto !== id_repuesto) }));
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)]">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Proveedor</label>
          <SearchableSelect value={formData.id_proveedor} onChange={field("id_proveedor")} className={inputCls}>
            <option value="">Seleccionar proveedor</option>
            {initialProveedores.map((p) => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre_empresa}</option>)}
          </SearchableSelect>
        </div>
        <div><label className="block text-sm font-medium mb-2">Total</label><input type="number" min={0} step="0.01" inputMode="decimal" value={formData.total} onChange={field("total")} className={inputCls} /></div>
        <div><label className="block text-sm font-medium mb-2">Estado</label>
          <SearchableSelect value={formData.estado} onChange={field("estado")} searchable={false} className={inputCls}>
            <option value="pendiente">Pendiente</option>
            <option value="en_transito">En Tránsito</option>
            <option value="recibida">Recibida</option>
            <option value="cancelada">Cancelada</option>
          </SearchableSelect>
        </div>

      </div>

      <div className="min-w-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold">Repuestos</h3>
          <span className="text-xs text-muted-foreground">{items.length} elemento{items.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="mb-4 grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
          <SearchableSelect
            value={repuestoActual}
            onChange={(e) => setRepuestoActual(e.target.value)}
            className={`${inputCls} min-w-0`}
          >
            <option value="">Seleccionar repuesto</option>
            {initialRepuestos
              .filter((r) => !items.some((it) => it.id_repuesto === r.id_repuesto))
              .map((r) => <option key={r.id_repuesto} value={r.id_repuesto}>{r.nombre}</option>)}
          </SearchableSelect>
          <input
            type="number"
            min={1}
            step="1"
            value={cantidadActual}
            onChange={(e) => setCantidadActual(e.target.value)}
            className={`${inputCls} w-24`}
            placeholder="Cant."
            aria-label="Cantidad de repuestos"
          />
          <button
            type="button"
            onClick={handleAgregarItem}
            disabled={!repuestoActual}
            className="shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar
          </button>
        </div>
        {items.length > 0 ? (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-accent/50">
                <tr className="text-left">
                  <th className="px-3 py-2 font-medium">Repuesto</th>
                  <th className="px-3 py-2 font-medium">Cantidad</th>
                  <th className="px-3 py-2 font-medium">Costo Unit.</th>
                  <th className="px-3 py-2 font-medium text-right">Quitar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((it) => (
                  <tr key={it.id_repuesto}>
                    <td className="px-3 py-2">{it.nombre}</td>
                    <td className="px-3 py-2">{it.cantidad}</td>
                    <td className="px-3 py-2">${Number(it.costo_unitario).toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">
                      <button type="button" onClick={() => handleQuitarItem(it.id_repuesto)} className="p-1 hover:bg-destructive/10 text-destructive rounded-md transition-colors" aria-label={`Quitar ${it.nombre}`}>
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Selecciona un repuesto arriba para agregarlo a la compra.
          </div>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="font-semibold">Total de la compra</span>
          <span className="text-lg font-semibold text-primary">${Number(formData.total || 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
