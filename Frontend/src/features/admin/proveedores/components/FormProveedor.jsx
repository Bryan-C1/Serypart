import { onlyLetters, onlyNit, onlyPhone } from "../../../../shared/utils/inputValidation";
import { SearchableSelect } from "../../../../shared/ui/searchable-select";

const inputCls = "w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring";

export function FormProveedor({ formData, setFormData }) {
  const field = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: key === "nombre_empresa" || key === "nombre_cliente" ? onlyLetters(e.target.value) : key === "nit" ? onlyNit(e.target.value) : key === "telefono" ? onlyPhone(e.target.value) : e.target.value }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nombre de la Empresa *</label>
          <input type="text" value={formData.nombre_empresa} onChange={field("nombre_empresa")} pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+" required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Nombre del Cliente</label>
          <input type="text" value={formData.nombre_cliente} onChange={field("nombre_cliente")} pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">NIT</label>
          <input type="text" inputMode="numeric" value={formData.nit} onChange={field("nit")} pattern="[0-9-]+" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input type="email" value={formData.email} onChange={field("email")} className={inputCls} />
          <p className="text-xs text-muted-foreground mt-1">Incluye un signo "@"</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Teléfono</label>
          <input type="tel" inputMode="tel" value={formData.telefono} onChange={field("telefono")} pattern="[0-9+()\s-]+" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Estado</label>
          <SearchableSelect value={formData.estado} onChange={field("estado")} searchable={false} className={inputCls}>
            <option value="activo">Activo</option>
            <option value="pendiente">Pendiente</option>
            <option value="inactivo">Inactivo</option>
            {formData.estado === "anulado" && <option value="anulado" disabled>Anulado</option>}
          </SearchableSelect>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Dirección</label>
        <input type="text" value={formData.direccion} onChange={field("direccion")} className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Notas</label>
        <textarea value={formData.notas} onChange={field("notas")} rows={3} className={`${inputCls} resize-none`} />
      </div>
    </div>
  );
}
