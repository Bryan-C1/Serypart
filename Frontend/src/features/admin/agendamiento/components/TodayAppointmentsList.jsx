import { Calendar, Clock, User, Car, Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { estadoLabel, estadoClass, getFechaLocalActual, getServicioNombre, getVehiculoNombre, getUsuarioNombre } from "../services/agendamientoData";
import { CustomScrollbar } from "../../../../shared/ui/CustomScrollbar";

export function TodayAppointmentsList({ citas = [], fecha = getFechaLocalActual(), onCitaClick }) {
  const appointmentsRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const fechaLabel = new Date(`${fecha}T00:00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const citasMostradas = useMemo(() => {
    if (!normalizedSearch) return citas.filter((cita) => cita.fecha_cita === fecha);

    return citas.filter((cita) => {
      const servicios = cita.servicios?.length ? cita.servicios : [{ id: cita.id_servicio }];
      const searchableText = [
        cita.fecha_cita,
        new Date(`${cita.fecha_cita}T00:00:00`).toLocaleDateString("es-ES"),
        getUsuarioNombre(cita.id_usuario, cita.nombre_cliente),
        getVehiculoNombre(cita.id_vehiculo, cita.nombre_vehiculo),
        ...servicios.map((servicio) => servicio.nombre || getServicioNombre(servicio.id)),
      ].join(" ").toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [citas, fecha, normalizedSearch]);

  return (
    <div className="relative bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">
          {normalizedSearch ? "Resultados de citas" : `${fecha === getFechaLocalActual() ? "Citas de Hoy" : "Citas del día"} - ${fechaLabel}`}
        </h3>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar por fecha, vehículo, cliente o servicio..."
          className="w-full rounded-lg border border-border bg-input-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Buscar citas"
        />
      </div>

      <div ref={appointmentsRef} className={`hide-scrollbar space-y-3 ${citasMostradas.length > 4 ? "max-h-[42rem] overflow-y-auto overscroll-contain pr-3" : ""}`}>
        {citasMostradas.map((cita) => (
          <button
            key={cita.id}
            type="button"
            onClick={() => onCitaClick(cita)}
            className="block w-full p-4 text-left bg-accent/30 border border-border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-semibold">{cita.hora_cita}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${estadoClass[cita.estado]}`}>
                {estadoLabel[cita.estado]}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-muted-foreground" />
                <span className="font-medium">{getUsuarioNombre(cita.id_usuario, cita.nombre_cliente)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Car className="w-3 h-3" />
                <span>{getVehiculoNombre(cita.id_vehiculo, cita.nombre_vehiculo)}</span>
              </div>
              <div className="text-muted-foreground space-y-1">
                {(cita.servicios?.length ? cita.servicios : [{ id: cita.id_servicio }]).map((servicio) => (
                  <p key={servicio.id}>{servicio.nombre || getServicioNombre(servicio.id)}</p>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{cita.observaciones || "Sin observaciones"}</p>
            </div>
          </button>
        ))}
      </div>
      {citasMostradas.length > 4 && <CustomScrollbar containerRef={appointmentsRef} />}
    </div>
  );
}
