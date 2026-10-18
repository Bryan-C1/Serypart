import { onlyDigits, onlyLetters, onlyPhone } from "../../../../shared/utils/inputValidation";
import { initialRoles } from "../../Roles/Services/rolesData";
import { SearchableSelect } from "../../../../shared/ui/searchable-select";

const inputCls = "w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring";

export function FormUsuario({ formData, setFormData, isEditing }) {
  const handleInvalidField = (event) => {
    const field = event.currentTarget;
    if (field.validity.valueMissing) {
      field.setCustomValidity("Este campo es obligatorio.");
    } else if (field.validity.typeMismatch) {
      field.setCustomValidity("Ingresa un correo electrónico válido.");
    } else if (field.validity.patternMismatch) {
      field.setCustomValidity("El formato ingresado no es válido.");
    }
  };

  const clearInvalidMessage = (event) => event.currentTarget.setCustomValidity("");

  const field = (key) => (e) =>
    setFormData((prev) => ({
      ...prev,
      [key]:
        key === "nombre" || key === "apellido" ? onlyLetters(e.target.value) :
        key === "numero_documento" ? onlyDigits(e.target.value) :
        key === "telefono" ? onlyPhone(e.target.value) :
        key === "id_rol" ? (e.target.value === "" ? "" : Number(e.target.value)) :
        e.target.value,
    }));

  return (
    <div className={`space-y-4${isEditing ? "" : " new-user-form"}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tipo de Documento</label>
          <SearchableSelect value={formData.tipo_documento} onChange={field("tipo_documento")} className={`${inputCls}${isEditing ? "" : " new-user-select"}`}>
            <option value="">Seleccionar</option>
            <option value="CC">Cédula Ciudadanía</option>
            <option value="PA">Pasaporte</option>
            <option value="PPT">PPT</option>
            <option value="EX">Extranjero</option>
          </SearchableSelect>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Número de Documento</label>
          <input type="text" inputMode="numeric" placeholder="Ej: 1234567890" value={formData.numero_documento} onChange={field("numero_documento")} onInvalid={handleInvalidField} onInput={clearInvalidMessage} pattern="[0-9]+" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Nombre *</label>
          <input type="text" placeholder="Ej: Juan" value={formData.nombre} onChange={field("nombre")} onInvalid={handleInvalidField} onInput={clearInvalidMessage} pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+" required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Apellido</label>
          <input type="text" placeholder="Ej: Pérez" value={formData.apellido} onChange={field("apellido")} onInvalid={handleInvalidField} onInput={clearInvalidMessage} pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Teléfono</label>
          <input type="tel" inputMode="tel" placeholder="Ej: +57 300 123 4567" value={formData.telefono} onChange={field("telefono")} onInvalid={handleInvalidField} onInput={clearInvalidMessage} pattern="[0-9+()\s-]+" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Dirección</label>
          <input type="text" placeholder="Ej: Calle 10 # 20-30" value={formData.direccion} onChange={field("direccion")} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Correo *</label>
          <input type="email" placeholder="Ej: juan@correo.com" value={formData.email} onChange={field("email")} onInvalid={handleInvalidField} onInput={clearInvalidMessage} required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Contraseña{isEditing ? "" : " *"}</label>
          <input type="password" placeholder="Ej: ********" value={formData.contraseña} onChange={field("contraseña")} onInvalid={handleInvalidField} onInput={clearInvalidMessage} required={!isEditing} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Rol *</label>
          <SearchableSelect value={formData.id_rol} onChange={field("id_rol")} required className={`${inputCls}${isEditing ? "" : " new-user-select"}`}>
            <option value="">Seleccionar rol</option>
            {initialRoles.map((rol) => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </SearchableSelect>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Estado</label>
          <SearchableSelect value={formData.estado} onChange={field("estado")} searchable={false} className={`${inputCls}${isEditing ? "" : " new-user-select"}`}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </SearchableSelect>
        </div>
      </div>
    </div>
  );
}
