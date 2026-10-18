import { Mail, Phone, Eye, Edit, Ban } from "lucide-react";
import { activeInactiveStatusOptions, annulledStatusOption, EntityStatusSelect } from "../../components/EntityStatusSelect";

export function ProveedoresTable({ proveedores, onToggleEstado, onVerDetalles, onEditar, onAnular }) {
  const providerStatusOptions = [
    ...activeInactiveStatusOptions,
    { value: "pendiente", label: "Pendiente", className: "bg-warning/10 text-warning" },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="text-left">
            <th className="pb-3 font-medium">Empresa</th>
            <th className="pb-3 font-medium">Cliente</th>
            <th className="pb-3 font-medium">NIT</th>
            <th className="pb-3 font-medium">Contacto</th>
            <th className="pb-3 font-medium">Dirección</th>
            <th className="pb-3 font-medium">Estado</th>
            <th className="pb-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {proveedores.length === 0 ? (
            <tr><td colSpan={7} className="py-10 text-center text-muted-foreground">No se encontraron proveedores</td></tr>
          ) : proveedores.map((p) => (
            <tr key={p.id_proveedor} onClick={() => onVerDetalles(p)} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <td className="py-4">
                <p className="font-medium">{p.nombre_empresa}</p>
                <p className="text-sm text-muted-foreground">NIT: {p.nit}</p>
              </td>
              <td className="py-4">
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /><span>{p.email}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /><span>{p.telefono}</span></div>
                </div>
              </td>
              <td className="py-4 text-sm">{p.nombre_cliente}</td>
              <td className="py-4 text-sm">{p.nit}</td>
              <td className="py-4 text-sm">{p.direccion}</td>
              <td className="py-4">
                <div onClick={(event) => event.stopPropagation()}>
                  <EntityStatusSelect
                    value={p.estado}
                    options={p.estado === "anulado"
                      ? [activeInactiveStatusOptions[0], annulledStatusOption]
                      : [...providerStatusOptions, annulledStatusOption]}
                    ariaLabel={`Estado del proveedor ${p.nombre_empresa}`}
                    onChange={(estado) => onToggleEstado(p, estado)}
                  />
                </div>
              </td>
              <td className="py-4">
                <div className="flex items-center justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                  <button onClick={() => onVerDetalles(p)} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Ver detalles"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => onEditar(p)} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Editar"><Edit className="w-4 h-4" /></button>
                  {p.estado !== "anulado" && <button onClick={() => onAnular(p)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors" title="Anular"><Ban className="w-4 h-4" /></button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
