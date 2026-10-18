import { Clock, DollarSign, Eye, Edit, Ban } from "lucide-react";
import { getTipoVehiculoNombre } from "../services/serviciosData";
import { activeInactiveStatusOptions, annulledStatusOption, EntityStatusSelect } from "../../components/EntityStatusSelect";

export function ServiciosTable({ servicios, onToggleEstado, onVer, onEditar, onEliminar }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="text-left">
            <th className="pb-3 font-medium">Servicio</th>
            <th className="pb-3 font-medium">Tipo de Vehículo</th>
            <th className="pb-3 font-medium">Duración Estimada</th>
            <th className="pb-3 font-medium">Precio</th>
            <th className="pb-3 font-medium">Estado</th>
            <th className="pb-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {servicios.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-10 text-center text-muted-foreground">No se encontraron servicios</td>
            </tr>
          ) : (
            servicios.map((s) => (
              <tr key={s.id} onClick={() => onVer(s)} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <td className="py-4">
                  <div>
                    <p className="font-medium">{s.nombre}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{s.descripcion}</p>
                  </div>
                </td>
                <td className="py-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium text-xs">
                    {getTipoVehiculoNombre(s.id_tipo_vehiculo)}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{s.duracion_estimada}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1 font-semibold text-primary">
                    <DollarSign className="w-4 h-4" />
                    <span>{s.precio}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div onClick={(event) => event.stopPropagation()}>
                    <EntityStatusSelect
                      value={s.estado}
                      options={s.estado === "anulado"
                        ? [activeInactiveStatusOptions[0], annulledStatusOption]
                        : [...activeInactiveStatusOptions, annulledStatusOption]}
                      ariaLabel={`Estado del servicio ${s.nombre}`}
                      onChange={(estado) => onToggleEstado(s.id, estado)}
                    />
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                    <button onClick={() => onVer(s)} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Ver detalles">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEditar(s)} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Editar">
                      <Edit className="w-4 h-4" />
                    </button>
                    {s.estado !== "anulado" && <button onClick={() => onEliminar(s.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors" title="Anular">
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
