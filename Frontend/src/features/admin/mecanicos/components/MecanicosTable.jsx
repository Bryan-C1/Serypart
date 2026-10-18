import { Phone, Eye, Edit, Ban } from "lucide-react";
import { activeInactiveStatusOptions, annulledStatusOption, EntityStatusSelect } from "../../components/EntityStatusSelect";

export function MecanicosTable({ mecanicos, onToggleEstado, onVerDetalles, onEditar, onAnular }) {
  const mechanicStatusOptions = [
    ...activeInactiveStatusOptions,
    { value: "vacaciones", label: "Vacaciones", className: "bg-warning/10 text-warning" },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="text-left">
            <th className="pb-3 font-medium">Tipo de documento</th>
            <th className="pb-3 font-medium">Número de documento</th>
            <th className="pb-3 font-medium">Nombre</th>
            <th className="pb-3 font-medium">Apellido</th>
            <th className="pb-3 font-medium">Teléfono</th>
            <th className="pb-3 font-medium">Dirección</th>
            <th className="pb-3 font-medium">Horario de disponibilidad</th>
            <th className="pb-3 font-medium">Estado</th>
            <th className="pb-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {mecanicos.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-10 text-center text-muted-foreground">No se encontraron mecánicos</td>
            </tr>
          ) : (
            mecanicos.map((m) => (
              <tr key={m.id} onClick={() => onVerDetalles(m)} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <td className="py-4 text-sm">{m.tipoDocumento || "—"}</td>
                <td className="py-4 text-sm">{m.numeroDocumento || "—"}</td>
                <td className="py-4 font-medium">{m.nombre}</td>
                <td className="py-4">{m.apellido || "—"}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{m.telefono || "—"}</span>
                  </div>
                </td>
                <td className="py-4 text-sm">{m.direccion || "—"}</td>
                <td className="py-4 text-sm">{m.horarioDisponibilidad || "—"}</td>
                <td className="py-4">
                  <div onClick={(event) => event.stopPropagation()}>
                    <EntityStatusSelect
                      value={m.estado}
                      options={m.estado === "anulado"
                        ? [activeInactiveStatusOptions[0], annulledStatusOption]
                        : [...mechanicStatusOptions, annulledStatusOption]}
                      ariaLabel={`Estado del mecánico ${m.nombre}`}
                      onChange={(estado) => onToggleEstado(m, estado)}
                    />
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                    <button onClick={() => onVerDetalles(m)} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Ver detalles">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEditar(m)} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Editar">
                      <Edit className="w-4 h-4" />
                    </button>
                    {m.estado !== "anulado" && <button onClick={() => onAnular(m)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors" title="Anular">
                      <Ban className="w-4 h-4" />
                    </button>}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
