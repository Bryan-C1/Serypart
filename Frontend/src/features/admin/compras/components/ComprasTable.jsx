import { Eye, Edit, Ban } from "lucide-react";
import { estadoConfig } from "../services/comprasData";
import { getProveedorNombre } from "../../proveedores/services/proveedoresData";
import { EntityStatusSelect } from "../../components/EntityStatusSelect";

const purchaseStatusOptions = ["pendiente", "en_transito", "recibida"].map((estado) => ({
  value: estado,
  label: estadoConfig[estado].label,
  className: estadoConfig[estado].cls,
}));

export function ComprasTable({ compras, onVerDetalles, onEditar, onAnular, onCambiarEstado }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="text-left">
            <th className="pb-3 font-medium">Proveedor</th>
            <th className="pb-3 font-medium">Total</th>
            <th className="pb-3 font-medium">Estado</th>
            <th className="pb-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {compras.length === 0 ? (
            <tr><td colSpan={4} className="py-10 text-center text-muted-foreground">No se encontraron compras</td></tr>
          ) : compras.map((c) => (
            <tr key={c.id_compra} onClick={() => onVerDetalles(c)} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <td className="py-4">{c.id_proveedor ? getProveedorNombre(c.id_proveedor) : "—"}</td>
              <td className="py-4 font-semibold">${Number(c.total).toFixed(2)}</td>
              <td className="py-4">
                <div onClick={(event) => event.stopPropagation()}>
                  <EntityStatusSelect
                    value={c.estado}
                    options={c.estado === "cancelada"
                      ? [...purchaseStatusOptions, { value: "cancelada", label: estadoConfig.cancelada.label, className: estadoConfig.cancelada.cls, hiddenFromMenu: true }]
                      : purchaseStatusOptions}
                    ariaLabel={`Estado de compra ${c.id_compra}`}
                    onChange={(estado) => onCambiarEstado(c, estado)}
                  />
                </div>
              </td>
              <td className="py-4">
                <div className="flex items-center justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                  <button onClick={() => onVerDetalles(c)} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Ver detalles"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => onEditar(c)} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Editar"><Edit className="w-4 h-4" /></button>
                  {c.estado !== "cancelada" && <button onClick={() => onAnular(c)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors" title="Anular"><Ban className="w-4 h-4" /></button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
