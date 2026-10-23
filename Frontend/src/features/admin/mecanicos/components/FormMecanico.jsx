import { onlyDigits, onlyLetters, onlyPhone } from "../../../../shared/utils/inputValidation";
import { especialidades } from "../services/mecanicosData";
import { SearchableSelect } from "../../../../shared/ui/searchable-select";

export function FormMecanico({ formData, setFormData }) {
  const field = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: key === "nombre" || key === "apellido" ? onlyLetters(e.target.value) : key === "numeroDocumento" ? onlyDigits(e.target.value) : key === "telefono" ? onlyPhone(e.target.value) : e.target.value }));

  const inputCls = "w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tipo de Documento</label>
          <SearchableSelect value={formData.tipoDocumento} onChange={field("tipoDocumento")} className={inputCls}>
            <option value="V">Venezolano</option>
            <option value="CC">Cédula Ciudadanía</option>
            <option value="PA">Pasaporte</option>
            <option value="PPT">PPT</option>
            <option value="EX">Extranjero</option>
          </SearchableSelect>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Número de Documento</label>
          <input type="text" inputMode="numeric" value={formData.numeroDocumento} onChange={field("numeroDocumento")} pattern="[0-9]+" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Nombre *</label>
          <input type="text" value={formData.nombre} onChange={field("nombre")} pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+" required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Apellido</label>
          <input type="text" value={formData.apellido} onChange={field("apellido")} pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Teléfono</label>
          <input type="tel" inputMode="tel" value={formData.telefono} onChange={field("telefono")} pattern="[0-9+()\s-]+" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Dirección</label>
          <input type="text" value={formData.direccion} onChange={field("direccion")} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Estado</label>
          <SearchableSelect value={formData.estado} onChange={field("estado")} searchable={false} className={inputCls}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="vacaciones">Vacaciones</option>
            {formData.estado === "anulado" && <option value="anulado" disabled>Anulado</option>}
          </SearchableSelect>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Turno</label>
          <SearchableSelect value={formData.turno} onChange={field("turno")} className={inputCls}>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Completo">Completo</option>
          </SearchableSelect>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <input type="email" value={formData.email} onChange={field("email")} required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Especialidad</label>
          <SearchableSelect value={formData.especialidad} onChange={field("especialidad")} className={inputCls}>
            {especialidades.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </SearchableSelect>
        </div>
      </div>
    </div>
  );
}
