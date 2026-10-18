import { useEffect, useState } from "react";
import { X, Wrench, Clock, DollarSign } from "lucide-react";
import { servicioIcono, getTipoVehiculoNombre } from "../services/serviciosData";
import { CITAS_UPDATED_EVENT, getCitasGuardadas } from "../../agendamiento/services/agendamientoData";
import { getCitas } from "../../agendamiento/services/agendamientoService";

export function ServicioDetailModal({ open, servicio, onClose, onEditar }) {
  const [citas, setCitas] = useState(() => getCitasGuardadas());
  const [citasError, setCitasError] = useState("");
  useEffect(() => {
    let active = true;
    const actualizarCitas = () => setCitas(getCitasGuardadas());
    getCitas()
      .then((records) => {
        if (active) setCitas(records);
      })
      .catch((error) => {
        if (active) setCitasError(error.message);
      });
    window.addEventListener(CITAS_UPDATED_EVENT, actualizarCitas);
    return () => {
      active = false;
      window.removeEventListener(CITAS_UPDATED_EVENT, actualizarCitas);
    };
  }, []);

  if (!open || !servicio) return null;
  const IconoServicio = servicioIcono || Wrench;
  const citasDelServicio = citas.filter((cita) => (
    cita.servicios?.length
      ? cita.servicios.some((item) => item.id === servicio.id)
      : Number(cita.id_servicio) === Number(servicio.id)
  ));
  const citasPedidas = citasDelServicio.length;
  const citasRealizadas = citasDelServicio.filter((cita) => ["completada", "entregada"].includes(cita.estado)).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
          <h2 className="text-xl font-semibold">Detalles del Servicio</h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <IconoServicio className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-2">{servicio.nombre}</h3>
              <p className="text-muted-foreground">{servicio.descripcion || "Sin descripción"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tipo de vehículo</p>
              <p className="font-medium">{getTipoVehiculoNombre(servicio.id_tipo_vehiculo)}</p>
            </div>
            {citasError && <p role="alert" className="text-sm text-destructive">No se pudieron cargar las citas: {citasError}</p>}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Estado</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                servicio.estado === "activo"
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              }`}>
                {servicio.estado === "anulado" ? "Anulado" : servicio.estado === "activo" ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Duración estimada</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium">{servicio.duracion_estimada}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Precio</p>
              <div className="flex items-center gap-1 text-2xl font-semibold text-primary">
                <DollarSign className="w-6 h-6" />
                <span>{servicio.precio}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Citas pedidas</p>
              <p className="font-medium">{citasPedidas}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Citas realizadas</p>
              <p className="font-medium">{citasRealizadas}</p>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-border flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
            Cerrar
          </button>
          <button
            onClick={() => onEditar(servicio)}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors"
          >
            Editar Servicio
          </button>
        </div>
      </div>
    </div>
  );
}
