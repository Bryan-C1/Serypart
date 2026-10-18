import { PermisosGrid } from "./PermisosGrid";
import { onlyLetters } from "../../../../shared/utils/inputValidation";

export function FormRole({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Nombre del Rol *</label>
        <input
          type="text"
          placeholder="Ej: Supervisor de Taller"
          value={formData.nombre}
          onChange={(e) => setFormData((f) => ({ ...f, nombre: onlyLetters(e.target.value) }))}
          pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+"
          required
          className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Descripción</label>
        <textarea
          placeholder="Describe brevemente las responsabilidades de este rol"
          rows={2}
          value={formData.descripcion}
          onChange={(e) => setFormData((f) => ({ ...f, descripcion: e.target.value }))}
          className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Permisos por Módulo</label>
        <PermisosGrid
          permisos={formData.permisos}
          onChange={(permisos) => setFormData((f) => ({ ...f, permisos }))}
        />
      </div>
    </div>
  );
}
