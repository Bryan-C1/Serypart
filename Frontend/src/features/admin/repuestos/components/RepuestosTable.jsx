import { Package, Eye, Edit, Ban } from "lucide-react";
import { useState } from "react";
import { StatusConfirmModal } from "../../components/StatusConfirmModal";
import { EntityStatusSelect } from "../../components/EntityStatusSelect";

export function RepuestosTable({
  repuestos,
  getMarcaNombre,
  onVerDetalles,
  onEditar,
  onAnular,
  onReactivar,
  onCambiarEstado,
}) {
  const [pendingReactivation, setPendingReactivation] = useState(null);
  const estadoLabel = {
    disponible: "Disponible",
    bajo_stock: "Stock Bajo",
    agotado: "Agotado",
    anulado: "Anulado",
  };
  const estadoClass = {
    disponible: "bg-success !text-white",
    bajo_stock: "bg-warning !text-black",
    agotado: "bg-destructive !text-white",
    anulado: "bg-muted text-muted-foreground",
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="text-left">
            <th className="pb-3 font-medium">Repuesto</th>
            <th className="pb-3 font-medium">Descripción</th>
            <th className="pb-3 font-medium">Marca</th>
            <th className="pb-3 font-medium">Stock</th>
            <th className="pb-3 font-medium">Precio Unitario</th>
            <th className="pb-3 font-medium">Estado</th>
            <th className="pb-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {repuestos.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="py-10 text-center text-muted-foreground">
                No se encontraron repuestos
              </td>
            </tr>
          ) : (
            repuestos.map(repuesto => (
              <tr
                key={repuesto.id_repuesto}
                onClick={() => onVerDetalles(repuesto)}
                className="cursor-pointer hover:bg-accent/50 transition-colors">
                <td className="py-4" onClick={(event) => event.stopPropagation()}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{repuesto.nombre}</span>
                  </div>
                </td>
                <td className="py-4 text-sm">{repuesto.descripcion}</td>
                <td className="py-4 text-sm">
                  {getMarcaNombre(repuesto.id_marca_repuesto)}
                </td>
                <td className="py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold ${
                          repuesto.stock === 0
                            ? "text-destructive"
                            : repuesto.stock <= repuesto.stock_minimo
                              ? "text-warning"
                              : "text-success"
                        }`}>
                        {repuesto.stock}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        unidades
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Mín: {repuesto.stock_minimo}
                    </div>
                  </div>
                </td>
                <td className="py-4 font-semibold">
                  ${Number(repuesto.precio_unitario).toFixed(2)}
                </td>
                <td className="py-4">
                  <EntityStatusSelect
                    value={repuesto.estado}
                    ariaLabel={`Estado de ${repuesto.nombre}`}
                    options={[
                      { value: "disponible", label: estadoLabel.disponible, className: estadoClass.disponible },
                      { value: "bajo_stock", label: estadoLabel.bajo_stock, className: estadoClass.bajo_stock },
                      { value: "agotado", label: estadoLabel.agotado, className: estadoClass.agotado },
                      ...(repuesto.estado === "anulado"
                        ? [{ value: "anulado", label: estadoLabel.anulado, className: estadoClass.anulado, disabled: true }]
                        : []),
                    ]}
                    disabled={repuesto.estado === "anulado"}
                    onChange={estado => onCambiarEstado(repuesto, estado)}
                  />
                  {repuesto.estado === "anulado" && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setPendingReactivation(repuesto);
                      }}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      Reactivar
                    </button>
                  )}
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                    <button
                      onClick={() => onVerDetalles(repuesto)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                      title="Ver detalles">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditar(repuesto)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                      title="Editar">
                      <Edit className="w-4 h-4" />
                    </button>
                    {repuesto.estado !== "anulado" && <button
                      onClick={() => onAnular(repuesto)}
                      className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                      title="Anular">
                      <Ban className="w-4 h-4" />
                    </button>}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <StatusConfirmModal
        item={pendingReactivation}
        entityName={pendingReactivation?.nombre}
        isActive={false}
        title="Reactivar repuesto"
        actionText="reactivar"
        actionLabel="Activar"
        onCancel={() => setPendingReactivation(null)}
        onConfirm={() => {
          onReactivar(pendingReactivation);
          setPendingReactivation(null);
        }}
      />
    </div>
  );
}
