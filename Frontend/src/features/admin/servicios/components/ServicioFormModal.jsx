import { X } from "lucide-react";
import { ImageWithFallback } from "../../../../shared/figma/ImageWithFallback";
import { onlyLetters, reportInvalidField } from "../../../../shared/utils/inputValidation";
import { tiposVehiculo } from "../services/serviciosData";
import { SearchableSelect } from "../../../../shared/ui/searchable-select";

export function ServicioFormModal({ modal, form, setForm, onClose, onGuardar, saving, error }) {
  if (modal !== "crear" && modal !== "editar") return null;

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({
      ...current,
      imagen: reader.result,
      imagenArchivo: file,
    }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
          <h2 className="text-xl font-semibold">{modal === "crear" ? "Nuevo Servicio" : "Editar Servicio"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4 service-form">
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <div>
            <label className="block text-sm font-medium mb-2">Nombre del Servicio *</label>
            <input
              type="text"
              placeholder="Ej: Cambio de Aceite"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: onlyLetters(e.target.value) }))}
              pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+"
              required
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              placeholder="Descripción del servicio"
              rows={3}
              value={form.descripcion}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Imagen del servicio</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-secondary"
            />
            {form.imagen && (
              <ImageWithFallback
                src={form.imagen}
                alt="Vista previa del servicio"
                className="mt-3 h-32 w-full rounded-lg object-cover"
              />
            )}
            <p className="mt-1 text-xs text-muted-foreground">Selecciona una imagen JPG, PNG o WEBP.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Precio ($) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="45.00"
                value={form.precio || ""}
                required
                onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value === "" ? "" : Number(e.target.value) }))}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duración estimada</label>
              <input
                type="text"
                placeholder="45 min"
                value={form.duracion_estimada}
                onChange={(e) => setForm((f) => ({ ...f, duracion_estimada: e.target.value }))}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de vehículo</label>
              <SearchableSelect
                value={form.id_tipo_vehiculo}
                onChange={(e) => setForm((f) => ({ ...f, id_tipo_vehiculo: Number(e.target.value) }))}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring service-select"
              >
                {tiposVehiculo.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>)}
              </SearchableSelect>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <SearchableSelect
                value={form.estado}
                onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))}
                searchable={false}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring service-select"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </SearchableSelect>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-border flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => reportInvalidField() && onGuardar()}
            disabled={!form.nombre || !form.precio || saving}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando..." : modal === "crear" ? "Guardar Servicio" : "Actualizar Servicio"}
          </button>
        </div>
      </div>
    </div>
  );
}
