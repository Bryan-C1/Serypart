import { X, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { estadoLabel } from "../services/vehiculosData";

export function VehiculoDetailModal({ open, vehiculo, onClose, onEditar }) {
  const navigate = useNavigate();
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
      <div className="bg-card border border-border rounded-lg max-w-lg w-full">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold">Detalle del Vehículo</h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
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
