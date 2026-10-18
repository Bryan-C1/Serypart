import { Car, Eye, Edit, Ban } from "lucide-react";
import { estadoClass } from "../services/vehiculosData";
import { annulledStatusOption, EntityStatusSelect } from "../../components/EntityStatusSelect";

export function VehiculoCardGrid({ vehiculos, onToggleEstado, onVer, onEditar, onEliminar }) {
  const vehicleStatusOptions = [
    { value: "activo", label: "Activo", className: estadoClass.activo },
    { value: "en_servicio", label: "En Servicio", className: estadoClass.en_servicio },
    { value: "inactivo", label: "Inactivo", className: estadoClass.inactivo },
  ];

  if (vehiculos.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No se encontraron vehículos.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vehiculos.map((v) => (
        <div key={v.id} onClick={() => onVer(v)} className="cursor-pointer bg-accent/30 border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-lg">{v.placa}</p>
                <p className="text-sm text-muted-foreground">{v.nombre_cliente || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
              <EntityStatusSelect
                value={v.estado}
                options={v.estado === "anulado"
                  ? [vehicleStatusOptions[0], annulledStatusOption]
                  : [...vehicleStatusOptions, annulledStatusOption]}
                ariaLabel={`Estado del vehículo ${v.placa}`}
                onChange={(estado) => onToggleEstado(v.id, estado)}
              />
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {[
              { label: "Marca", value: v.marca || "—" },
              { label: "Modelo", value: v.modelo || "—" },
              { label: "Año", value: v.año },
              { label: "Color", value: v.color },
              { label: "Tipo de Vehículo", value: v.tipo_vehiculo || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-3 border-t border-border" onClick={(event) => event.stopPropagation()}>
            <button
              onClick={() => onVer(v)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-background hover:bg-accent rounded-lg transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              Ver
            </button>
            <button
              onClick={() => onEditar(v)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-background hover:bg-accent rounded-lg transition-colors text-sm"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            {v.estado !== "anulado" && <button
              onClick={() => onEliminar(v.id)}
              className="px-3 py-2 bg-background hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
              title="Anular"
            >
              <Ban className="w-4 h-4" />
            </button>}
          </div>
        </div>
      ))}
    </div>
  );
}
