import { MapPin, Phone, Eye, Edit, Ban } from "lucide-react";
import { activeInactiveStatusOptions, annulledStatusOption, EntityStatusSelect } from "../../components/EntityStatusSelect";

export function ClientesTable({ clientes, onToggleEstado, onVerDetalles, onVerVehiculos, onEditar, onEliminar }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="text-left">
            <th className="pb-3 font-medium">Nombre</th>
            <th className="pb-3 font-medium">Apellido</th>
            <th className="pb-3 pl-3 font-medium">Tipo de documento</th>
            <th className="pb-3 font-medium">Número de documento</th>
            <th className="pb-3 font-medium">Teléfono</th>
            <th className="pb-3 font-medium">Dirección</th>
            <th className="pb-3 font-medium">Estado</th>
            <th className="pb-3 font-medium">Vehículos</th>
            <th className="-translate-x-8 pb-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {clientes.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-10 text-center text-muted-foreground">No se encontraron clientes</td>
            </tr>
          ) : (
            clientes.map((cliente) => (
              <tr key={cliente.id} onClick={() => onVerDetalles(cliente)} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <td className="py-4 font-medium">{cliente.nombre}</td>
                <td className="py-4">{cliente.apellido}</td>
                <td className="py-4 pl-3">{cliente.tipoDocumento}</td>
                <td className="py-4">{cliente.numeroDocumento}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{cliente.telefono}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span>{cliente.direccion}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div onClick={(event) => event.stopPropagation()}>
                    <EntityStatusSelect
                      value={cliente.estado}
                      options={cliente.estado === "anulado"
                        ? [activeInactiveStatusOptions[0], annulledStatusOption]
                        : [...activeInactiveStatusOptions, annulledStatusOption]}
                      ariaLabel={`Estado de ${cliente.nombre} ${cliente.apellido}`}
                      onChange={(estado) => onToggleEstado(cliente, estado)}
                    />
                  </div>
                </td>
                <td className="py-4" onClick={(event) => event.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onVerVehiculos(cliente)}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                    title="Ver vehículos del cliente"
                  >
                    {cliente.vehiculos} vehículo{cliente.vehiculos !== 1 ? "s" : ""}
                  </button>
                </td>
                <td className="py-4">
                  <div className="flex items-center justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                    <button onClick={() => onVerDetalles(cliente)} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Ver detalles">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEditar(cliente)} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Editar">
                      <Edit className="w-4 h-4" />
                    </button>
                    {cliente.estado !== "anulado" && <button onClick={() => onEliminar(cliente)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors" title="Anular">
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
