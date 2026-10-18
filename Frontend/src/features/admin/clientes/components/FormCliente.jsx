import { onlyDigits, onlyLetters } from "../../../../shared/utils/inputValidation";
import { SearchableSelect } from "../../../../shared/ui/searchable-select";

export function FormCliente({ formData, setFormData }) {
  const field = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: key === "nombre" || key === "apellido" ? onlyLetters(e.target.value) : key === "numeroDocumento" || key === "telefono" ? onlyDigits(e.target.value).slice(0, 10) : e.target.value }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tipo de documento</label>
          <SearchableSelect value={formData.tipoDocumento} onChange={field("tipoDocumento")} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="CC">CC</option>
            <option value="CE">CE</option>
            <option value="NIT">NIT</option>
            <option value="Pasaporte">Pasaporte</option>
          </SearchableSelect>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Número de documento *</label>
          <input type="text" inputMode="numeric" maxLength={10} value={formData.numeroDocumento} onChange={field("numeroDocumento")} pattern="[0-9]{1,10}" required className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Nombre *</label>
          <input type="text" value={formData.nombre} onChange={field("nombre")} pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+" required className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Apellido *</label>
          <input type="text" value={formData.apellido} onChange={field("apellido")} pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+" required className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Teléfono</label>
          <input type="text" inputMode="numeric" maxLength={10} value={formData.telefono} onChange={field("telefono")} pattern="[0-9]{0,10}" className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Dirección</label>
          <input type="text" value={formData.direccion} onChange={field("direccion")} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Estado</label>
          <SearchableSelect value={formData.estado} onChange={field("estado")} searchable={false} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </SearchableSelect>
        </div>
      </div>
    </div>
  );
}
