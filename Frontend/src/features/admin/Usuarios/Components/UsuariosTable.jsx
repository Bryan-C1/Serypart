import { Mail, Phone, Eye, Pencil, Ban, UserX } from "lucide-react";
import { getRolNombre } from "../../Roles/Services/rolesData";
import { activeInactiveStatusOptions, annulledStatusOption, EntityStatusSelect } from "../../components/EntityStatusSelect";

export function UsuariosTable({ usuarios, onToggleEstado, onVerDetalles, onEditar, onEliminar }) {
  if (usuarios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center border border-dashed border-border rounded-lg">
        <UserX className="w-8 h-8 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">No hay usuarios registrados</p>
        <p className="text-xs text-muted-foreground">Crea el primer usuario para dar acceso al sistema.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="text-left">
            <th className="pb-3 font-medium">Usuario</th>
            <th className="pb-3 font-medium">Documento</th>
            <th className="pb-3 font-medium">Contacto</th>
            <th className="pb-3 font-medium">Rol</th>
            <th className="pb-3 font-medium">Estado</th>
            <th className="pb-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {usuarios.map((usuario) => (
            <tr key={usuario.id_usuario} onClick={() => onVerDetalles(usuario)} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <td className="py-4">
                <p className="font-medium">{usuario.nombre} {usuario.apellido}</p>
              </td>
              <td className="py-4 text-sm text-muted-foreground">
                {usuario.tipo_documento ? `${usuario.tipo_documento}-${usuario.numero_documento || ""}` : (usuario.numero_documento || "—")}
              </td>
              <td className="py-4">
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{usuario.email}</span>
                  </div>
                  {usuario.telefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{usuario.telefono}</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="py-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {getRolNombre(usuario.id_rol)}
                </span>
              </td>
              <td className="py-4">
                <div onClick={(event) => event.stopPropagation()}>
                  <EntityStatusSelect
                    value={usuario.estado}
                    options={usuario.estado === "anulado"
                      ? [activeInactiveStatusOptions[0], annulledStatusOption]
                      : [...activeInactiveStatusOptions, annulledStatusOption]}
                    ariaLabel={`Estado del usuario ${usuario.nombre} ${usuario.apellido}`}
                    onChange={(estado) => onToggleEstado(usuario, estado)}
                  />
                </div>
              </td>
              <td className="py-4">
                <div className="flex items-center justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                  <button
                    onClick={() => onVerDetalles(usuario)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditar(usuario)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                    aria-label="Editar usuario"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {usuario.estado !== "anulado" && <button
                    onClick={() => onEliminar(usuario)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                    aria-label="Anular usuario"
                    title="Anular"
                  >
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
