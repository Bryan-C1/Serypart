import { Wrench, Clock, DollarSign, Eye, Edit, Ban } from "lucide-react";
import { ImageWithFallback } from "../../../../shared/figma/ImageWithFallback";
import { servicioIcono, servicioImagenes, getTipoVehiculoNombre } from "../services/serviciosData";
import { activeInactiveStatusOptions, annulledStatusOption, EntityStatusSelect } from "../../components/EntityStatusSelect";

export function ServicioCardGrid({ servicios, onToggleEstado, onVer, onEditar, onEliminar }) {
  if (servicios.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No se encontraron servicios.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {servicios.map((s) => {
        const IconoServicio = servicioIcono || Wrench;
        return (
          <div key={s.id} onClick={() => onVer(s)} className="cursor-pointer bg-accent/30 border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-40 overflow-hidden bg-primary/10">
              <ImageWithFallback
                src={s.imagen || servicioImagenes[s.id]}
                alt={s.nombre}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute left-5 bottom-4 w-11 h-11 rounded-lg bg-white/90 flex items-center justify-center">
                <IconoServicio className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 truncate">{s.nombre}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{s.descripcion}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium text-xs">
                  {getTipoVehiculoNombre(s.id_tipo_vehiculo)}
                </span>
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
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{s.duracion_estimada}</span>
                </div>
                <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                  <DollarSign className="w-5 h-5" />
                  <span>{s.precio}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2" onClick={(event) => event.stopPropagation()}>
              <button
                onClick={() => onVer(s)}
                className="p-2 bg-background hover:bg-accent rounded-lg transition-colors"
                title="Ver detalles"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEditar(s)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-background hover:bg-accent rounded-lg transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              {s.estado !== "anulado" && <button
                onClick={() => onEliminar(s.id)}
                className="p-2 bg-background hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                title="Anular"
              >
                <Ban className="w-4 h-4" />
              </button>}
            </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
