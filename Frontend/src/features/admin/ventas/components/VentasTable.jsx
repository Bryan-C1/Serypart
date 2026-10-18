import { Eye, Edit, Ban } from "lucide-react";
import { estadoConfig, getMetodoPagoNombre } from "../services/ventasData";
import { getUsuarioNombre } from "../../vehiculos/services/vehiculosData";
import { EntityStatusSelect } from "../../components/EntityStatusSelect";

const saleStatusOptions = ["pendiente", "pagada", "credito"].map((estado) => ({
  value: estado,
  label: estadoConfig[estado]?.label || estado,
  className: estadoConfig[estado]?.cls,
}));

export function VentasTable({ ventas, onVerDetalles, onEditar, onAnular, onCambiarEstado, updatingSaleId }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="text-left">
            <th className="pb-3 font-medium">Usuario</th>
            <th className="pb-3 font-medium">Total</th>
            <th className="pb-3 font-medium">Fecha de venta</th>
            <th className="pb-3 font-medium">Método</th>
            <th className="pb-3 font-medium">Estado</th>
            <th className="pb-3 pr-20 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {ventas.length === 0 ? (
            <tr><td colSpan={6} className="py-10 text-center text-muted-foreground">No se encontraron ventas</td></tr>
          ) : ventas.map((v) => (
            <tr key={v.id_venta} onClick={() => onVerDetalles(v)} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <td className="py-4">{v.nombre_usuario || getUsuarioNombre(v.id_cliente)}</td>
              <td className="py-4 font-semibold">${Number(v.total).toFixed(2)}</td>
              <td className="py-4">{v.fecha_venta}</td>
              <td className="py-4"><span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">{v.nombre_metodo_pago || getMetodoPagoNombre(v.id_metodo_pago)}</span></td>
              <td className="py-4">
                <div onClick={(event) => event.stopPropagation()}>
                  <EntityStatusSelect
                    value={v.estado}
                    options={v.estado === "cancelada"
                      ? [...saleStatusOptions, { value: "cancelada", label: "Anulada", disabled: true, hiddenFromMenu: true, className: estadoConfig.cancelada?.cls }]
                      : saleStatusOptions}
                    ariaLabel={`Cambiar estado de la venta de ${v.nombre_usuario || getUsuarioNombre(v.id_cliente)}`}
                    onChange={(estado) => onCambiarEstado(v, estado)}
                    disabled={updatingSaleId !== null}
                  />
                </div>
              </td>
              <td className="py-4">
                <div className="flex items-center justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                  <button onClick={() => onVerDetalles(v)} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Ver detalles"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => onEditar(v)} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Editar"><Edit className="w-4 h-4" /></button>
                  {v.estado !== "cancelada" && (
                    <button onClick={() => onAnular(v)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors" title="Anular venta">
                      <Ban className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
