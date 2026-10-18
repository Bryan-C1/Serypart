import { Eye, Edit, Ban } from "lucide-react";
import { estadoClass } from "../services/vehiculosData";
import { annulledStatusOption, EntityStatusSelect } from "../../components/EntityStatusSelect";

export function VehiculosTable({ vehiculos, onToggleEstado, onVer, onEditar, onEliminar }) {
  const vehicleStatusOptions = [
    { value: "activo", label: "Activo", className: estadoClass.activo },
    { value: "en_servicio", label: "En Servicio", className: estadoClass.en_servicio },
    { value: "inactivo", label: "Inactivo", className: estadoClass.inactivo },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="text-left">
            <th className="pb-3 font-medium">Tipo de vehículo</th>
            <th className="pb-3 font-medium">Placa</th>
            <th className="pb-3 font-medium">Cliente</th>
            <th className="pb-3 font-medium">Marca</th>
            <th className="pb-3 font-medium">Modelo</th>
            <th className="pb-3 font-medium">Color</th>
            <th className="pb-3 font-medium">Año</th>
            <th className="pb-3 font-medium">Estado</th>
            <th className="pb-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {vehiculos.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-10 text-center text-muted-foreground">No se encontraron vehículos</td>
            </tr>
          ) : (
            vehiculos.map((v) => (
              <tr key={v.id} onClick={() => onVer(v)} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <td className="py-4 text-sm">{v.tipo_vehiculo || "—"}</td>
                <td className="py-4 font-medium">{v.placa}</td>
                <td className="py-4 text-sm">{v.nombre_cliente || "—"}</td>
                <td className="py-4 text-sm">{v.marca || "—"}</td>
                <td className="py-4 text-sm">{v.modelo || "—"}</td>
                <td className="py-4 text-sm">{v.color}</td>
                <td className="py-4 text-sm">{v.año}</td>
                <td className="py-4">
                  <div onClick={(event) => event.stopPropagation()}>
                    <EntityStatusSelect
                      value={v.estado}
                      options={v.estado === "anulado"
                        ? [vehicleStatusOptions[0], annulledStatusOption]
                        : [...vehicleStatusOptions, annulledStatusOption]}
                      ariaLabel={`Estado del vehículo ${v.placa}`}
                      onChange={(estado) => onToggleEstado(v.id, estado)}
                    />
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                    <button onClick={() => onVer(v)} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Ver detalles">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEditar(v)} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Editar">
                      <Edit className="w-4 h-4" />
                    </button>
                    {v.estado !== "anulado" && <button onClick={() => onEliminar(v.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors" title="Anular">
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
