import { Eye, Edit, Ban, ShieldOff } from "lucide-react";
import { contarPermisosActivos } from "../Services/rolesData";
import { activeInactiveStatusOptions, annulledStatusOption, EntityStatusSelect } from "../../components/EntityStatusSelect";

export function RolesTable({ roles, onToggleEstado, onVerDetalles, onEditar, onEliminar }) {
  if (roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center border border-dashed border-border rounded-lg">
        <ShieldOff className="w-8 h-8 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">No hay roles registrados</p>
        <p className="text-xs text-muted-foreground">Crea el primer rol para empezar a asignar permisos.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="text-left">
            <th className="pb-3 font-medium">Rol</th>
            <th className="pb-3 font-medium">Descripción</th>
            <th className="pb-3 font-medium">Permisos</th>
            <th className="pb-3 font-medium">Usuarios</th>
            <th className="pb-3 font-medium">Estado</th>
            <th className="pb-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {roles.map((role) => (
            <tr key={role.id} onClick={() => onVerDetalles(role)} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <td className="py-4 font-medium">{role.nombre}</td>
              <td className="py-4 text-sm text-muted-foreground max-w-xs truncate">{role.descripcion}</td>
              <td className="py-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {contarPermisosActivos(role.permisos)} permisos
                </span>
              </td>
              <td className="py-4 text-sm">{role.usuariosAsignados}</td>
              <td className="py-4">
                <div onClick={(event) => event.stopPropagation()}>
                  <EntityStatusSelect
                    value={role.estado}
                    options={role.estado === "anulado"
                      ? [activeInactiveStatusOptions[0], annulledStatusOption]
                      : [...activeInactiveStatusOptions, annulledStatusOption]}
                    ariaLabel={`Estado del rol ${role.nombre}`}
                    onChange={(estado) => onToggleEstado(role, estado)}
                  />
                </div>
              </td>
              <td className="py-4">
                <div className="flex items-center justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                  <button onClick={() => onVerDetalles(role)} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Ver detalles">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => onEditar(role)} className="p-2 hover:bg-accent rounded-lg transition-colors" title="Editar">
                    <Edit className="w-4 h-4" />
                  </button>
                  {role.estado !== "anulado" && <button onClick={() => onEliminar(role)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors" title="Anular">
                    <Ban className="w-4 h-4" />
                  </button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
