import { useEffect, useState } from "react";
import { X, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { estadoLabel } from "../services/vehiculosData";
import { getHistorialVehiculo } from "../../agendamiento/services/agendamientoService";
import {
  estadoClass as estadoCitaClass,
  estadoLabel as estadoCitaLabel,
} from "../../agendamiento/services/agendamientoData";

export function VehiculoDetailModal({ open, vehiculo, onClose, onEditar }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("detalles");
  const [historial, setHistorial] = useState([]);
  const [historialLoading, setHistorialLoading] = useState(false);
  const [historialError, setHistorialError] = useState("");
  const [historialReload, setHistorialReload] = useState(0);

  useEffect(() => {
    if (!open) {
      setActiveTab("detalles");
      setHistorial([]);
      setHistorialLoading(false);
      setHistorialError("");
    }
  }, [open]);

  useEffect(() => {
    if (!open || !vehiculo || activeTab !== "historial") return undefined;
    let active = true;
    setHistorialLoading(true);
    setHistorialError("");

    getHistorialVehiculo(vehiculo.id)
      .then((rows) => {
        if (active) setHistorial(rows);
      })
      .catch((error) => {
        if (active) setHistorialError(error.message);
      })
      .finally(() => {
        if (active) setHistorialLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, vehiculo?.id, activeTab, historialReload]);

  if (!open || !vehiculo) return null;

  const fields = [
    { label: "Tipo de vehículo", value: vehiculo.tipo_vehiculo || "—" },
    { label: "Placa", value: vehiculo.placa },
    { label: "Cliente", value: vehiculo.nombre_cliente || "—" },
    { label: "Marca", value: vehiculo.marca || "—" },
    { label: "Modelo", value: vehiculo.modelo || "—" },
    { label: "Color", value: vehiculo.color },
    { label: "Año", value: vehiculo.año },
    { label: "Estado", value: estadoLabel[vehiculo.estado] },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto w-full">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold">Detalle del Vehículo</h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div role="tablist" aria-label="Información del vehículo" className="flex gap-5 border-b border-border px-6">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "detalles"}
            onClick={() => setActiveTab("detalles")}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${activeTab === "detalles" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Detalles
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "historial"}
            onClick={() => setActiveTab("historial")}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${activeTab === "historial" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Historial
          </button>
        </div>
        {activeTab === "detalles" ? (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                <Car className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {fields.map(({ label, value }) => (
                <div key={label} className="bg-accent/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className="font-medium text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-6">
            <div>
              <h3 className="font-semibold">Servicios y citas</h3>
              <p className="text-sm text-muted-foreground">Historial de {vehiculo.placa}</p>
            </div>
            {historialLoading ? (
              <p role="status" className="py-8 text-center text-sm text-muted-foreground">Cargando historial...</p>
            ) : historialError ? (
              <div role="alert" className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <span>{historialError}</span>
                <button type="button" onClick={() => setHistorialReload((value) => value + 1)} className="font-medium underline">
                  Reintentar
                </button>
              </div>
            ) : historial.length === 0 ? (
              <p className="rounded-lg border border-border p-8 text-center text-sm text-muted-foreground">
                Este vehículo todavía no tiene servicios o citas registrados.
              </p>
            ) : (
              <ol className="space-y-3">
                {historial.map((cita) => {
                  const servicios = cita.servicios
                    .map((servicio) => servicio.nombre)
                    .filter(Boolean)
                    .join(", ") || cita.servicio_nombre || "Servicio sin nombre";
                  const mecanico = [cita.mecanico_nombre, cita.mecanico_apellido].filter(Boolean).join(" ") || "Sin asignar";
                  return (
                    <li key={cita.id} className="rounded-lg border border-border bg-accent/20 p-4">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium">{cita.fecha_cita} · {cita.hora_cita}</p>
                        <span className={`rounded-full px-2 py-1 text-xs ${estadoCitaClass[cita.estado] || "bg-muted text-muted-foreground"}`}>
                          {estadoCitaLabel[cita.estado] || cita.estado || "Sin estado"}
                        </span>
                      </div>
                      <p className="font-medium">{servicios}</p>
                      <p className="mt-1 text-sm text-muted-foreground">Mecánico: {mecanico}</p>
                      <p className="mt-1 text-sm text-muted-foreground">Observaciones: {cita.observaciones || "Sin observaciones"}</p>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        )}
        <div className="p-6 border-t border-border flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
            Cerrar
          </button>
          <button
            onClick={() => onEditar(vehiculo)}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => { onClose(); navigate(`/agendamiento?vehiculo=${vehiculo.id}`); }}
            className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
          >
            Ver Servicios
          </button>
        </div>
      </div>
    </div>
  );
}
