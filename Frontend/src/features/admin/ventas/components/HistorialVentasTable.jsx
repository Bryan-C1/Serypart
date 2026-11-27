import { Eye } from "lucide-react";
import { estadoConfig, getMetodoPagoNombre } from "../services/ventasData";
import { getUsuarioNombre } from "../../vehiculos/services/vehiculosData";

export function HistorialVentasTable({ ventas, onVerDetalles }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="text-left">
            <th className="pb-3 font-medium">Venta</th>
            <th className="pb-3 font-medium">Fecha</th>
            <th className="pb-3 font-medium">Cliente</th>
            <th className="pb-3 font-medium">Conceptos</th>
            <th className="pb-3 font-medium">Total</th>
            <th className="pb-3 font-medium">Método</th>
            <th className="pb-3 font-medium">Estado</th>
            <th className="pb-3 font-medium text-right">Detalle</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {ventas.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-10 text-center text-muted-foreground">No hay ventas registradas</td>
            </tr>
          ) : ventas.map((venta) => (
            <tr key={venta.id_venta} className="hover:bg-accent/50 transition-colors">
              <td className="py-4 font-medium">#{venta.id_venta}</td>
              <td className="py-4">{venta.fecha_venta || "—"}</td>
              <td className="py-4">{venta.nombre_usuario || getUsuarioNombre(venta.id_cliente)}</td>
              <td className="max-w-xs py-4 text-sm">
                {venta.items?.length
                  ? venta.items.map((item) => `${item.nombre} × ${item.cantidad}`).join(", ")
                  : "Sin conceptos detallados"}
              </td>
              <td className="py-4 font-semibold">${Number(venta.total || 0).toFixed(2)}</td>
              <td className="py-4">{venta.nombre_metodo_pago || getMetodoPagoNombre(venta.id_metodo_pago)}</td>
              <td className="py-4">
                <span className={`rounded-full px-2 py-1 text-xs ${estadoConfig[venta.estado]?.cls || "bg-muted text-muted-foreground"}`}>
                  {estadoConfig[venta.estado]?.label || venta.estado}
                </span>
              </td>
              <td className="py-4 text-right">
                <button
                  type="button"
                  onClick={() => onVerDetalles(venta)}
                  className="rounded-lg p-2 transition-colors hover:bg-accent"
                  aria-label={`Ver detalle de la venta ${venta.id_venta}`}
                  title="Ver detalle"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
