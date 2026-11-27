import { ArrowDown, ArrowUp, Download } from "lucide-react";
import { EntityStatusSelect } from "../../components/EntityStatusSelect";
import { estadoLabel, estadoClass, getServicioNombre, getVehiculoNombre, getUsuarioNombre } from "../services/agendamientoData";
import { getMecanicoNombre } from "../../mecanicos/services/mecanicosService";

const appointmentStatusOptions = ["programada", "en_proceso", "completada"].map((estado) => ({
  value: estado,
  label: estadoLabel[estado],
  className: estadoClass[estado],
}));

export function UpcomingAppointmentsTable({
  citas, onCitaClick, onChangeStatus, sortDirection, onToggleSortDirection, onExport,
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold">Próximas Citas</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSortDirection}
            aria-label={`Cambiar a orden ${sortDirection === "asc" ? "descendente" : "ascendente"} por cliente`}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent transition-colors"
          >
            {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            {sortDirection === "asc" ? "Cliente: A-Z" : "Cliente: Z-A"}
          </button>
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent transition-colors"
          >
            <Download className="h-4 w-4" />
            Exportar Excel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr className="text-left">
              <th className="pb-3 font-medium">Fecha/Hora</th>
              <th className="pb-3 font-medium">Cliente</th>
              <th className="pb-3 font-medium">Vehículo</th>
              <th className="pb-3 font-medium">Servicio</th>
              <th className="pb-3 font-medium">Mecánico</th>
              <th className="pb-3 font-medium">Observaciones</th>
              <th className="pb-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {citas.map((cita) => (
              <tr key={cita.id} onClick={() => onCitaClick?.(cita)} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <td className="py-3">
                  <div>
                    <p className="font-medium">{cita.fecha_cita}</p>
                    <p className="text-sm text-muted-foreground">{cita.hora_cita}</p>
                  </div>
                </td>
                <td className="py-3">{getUsuarioNombre(cita.id_usuario, cita.nombre_cliente)}</td>
                <td className="py-3 text-sm">{getVehiculoNombre(cita.id_vehiculo, cita.nombre_vehiculo)}</td>
                <td className="py-3">
                  <div className="space-y-1">
                    {(cita.servicios?.length ? cita.servicios : [{ id: cita.id_servicio }]).map((servicio) => (
                      <div key={servicio.id}>{servicio.nombre || getServicioNombre(servicio.id)}</div>
                    ))}
                  </div>
                </td>
                <td className="py-3">{getMecanicoNombre(cita.id_mecanico)}</td>
                <td className="py-3 text-sm">{cita.observaciones || "-"}</td>
                <td className="py-3">
                  <div onClick={(event) => event.stopPropagation()}>
                    <EntityStatusSelect
                      value={cita.estado}
                      options={cita.estado === "cancelada"
                        ? [...appointmentStatusOptions, { value: "cancelada", label: estadoLabel.cancelada, className: estadoClass.cancelada, hiddenFromMenu: true }]
                        : appointmentStatusOptions}
                      ariaLabel={`Estado de la cita del ${cita.fecha_cita}`}
                      onChange={(estado) => onChangeStatus(cita, estado)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
