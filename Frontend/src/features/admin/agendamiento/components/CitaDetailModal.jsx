import { X } from "lucide-react";
import {
  estadoClass,
  estadoLabel,
  getServicioNombre,
  getUsuarioNombre,
  getVehiculoNombre,
} from "../services/agendamientoData";

export function CitaDetailModal({ cita, onClose, onEditar, onAnular }) {
  if (!cita) return null;

  const serviciosCita = cita.servicios?.length ? cita.servicios : [{ id: cita.id_servicio }];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-card">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-6">
          <div>
            <h2 className="text-xl font-semibold">Detalle de la cita</h2>
            <p className="mt-1 text-sm text-muted-foreground">Información de la cita agendada</p>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Cerrar detalle de la cita">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 font-semibold">Información de la cita</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Fecha:</span> <span className="font-medium">{cita.fecha_cita}</span></div>
                <div><span className="text-muted-foreground">Hora:</span> <span className="font-medium">{cita.hora_cita}</span></div>
                <div>
                  <span className="text-muted-foreground">Estado:</span>{" "}
                  <span className={`rounded-full px-2 py-1 text-xs ${estadoClass[cita.estado]}`}>
                    {estadoLabel[cita.estado] || cita.estado}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Cliente y vehículo</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Cliente:</span> <span className="font-medium">{getUsuarioNombre(cita.id_usuario, cita.nombre_cliente)}</span></div>
                <div><span className="text-muted-foreground">Vehículo:</span> <span className="font-medium">{getVehiculoNombre(cita.id_vehiculo, cita.nombre_vehiculo)}</span></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Servicios solicitados</h3>
            <div className="rounded-lg border border-border">
              {serviciosCita.map((servicio) => (
                <div key={servicio.id} className="border-b border-border px-4 py-3 text-sm last:border-b-0">
                  {servicio.nombre || getServicioNombre(servicio.id)}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Observaciones</h3>
            <p className="rounded-lg border border-border bg-accent/30 p-3 text-sm text-muted-foreground">
              {cita.observaciones || "Sin observaciones"}
            </p>
          </div>

          <div className="flex justify-between gap-3 border-t border-border pt-6">
            {cita.estado !== "cancelada" && (
              <button type="button" onClick={onAnular} className="rounded-lg px-6 py-2 text-destructive transition-colors hover:bg-destructive/10">
                Anular cita
              </button>
            )}
            <div className="flex gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border border-border px-6 py-2 transition-colors hover:bg-accent">
              Cerrar
            </button>
            {cita.estado !== "cancelada" && (
              <button type="button" onClick={onEditar} className="rounded-lg bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-secondary">
                Editar cita
              </button>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
