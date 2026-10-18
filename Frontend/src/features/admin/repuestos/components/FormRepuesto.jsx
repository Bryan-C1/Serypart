import { onlyLetters } from "../../../../shared/utils/inputValidation";
import { SearchableSelect } from "../../../../shared/ui/searchable-select";

export function FormRepuesto({ formData, setFormData, marcas }) {
  const field = (key) => (e) => {
    const value = e.target.type === "number" ? Number(e.target.value) : key === "nombre" ? onlyLetters(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nombre *</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={field("nombre")}
            pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+"
            placeholder="Ej: Filtro de Aceite Premium"
            required
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Marca del Repuesto</label>
          <SearchableSelect
            value={formData.id_marca_repuesto}
            onChange={field("id_marca_repuesto")}
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {marcas.map((marca) => <option key={marca.id} value={marca.id}>{marca.nombre}</option>)}
          </SearchableSelect>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Precio Unitario ($) *</label>
          <input type="number" min="0" step="0.01" inputMode="decimal" value={formData.precio_unitario} onChange={field("precio_unitario")} placeholder="0.00" required className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Stock Actual</label>
          <input
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={formData.stock}
            onChange={field("stock")}
            placeholder="0"
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Stock Mínimo</label>
          <input
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={formData.stock_minimo}
            onChange={field("stock_minimo")}
            placeholder="10"
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Estado</label>
          <SearchableSelect value={formData.estado} onChange={field("estado")} searchable={false} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="disponible">Disponible</option>
            <option value="bajo_stock">Stock Bajo</option>
            <option value="agotado">Agotado</option>
            {formData.estado === "anulado" && <option value="anulado" disabled>Anulado</option>}
          </SearchableSelect>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Descripción</label>
        <textarea value={formData.descripcion} onChange={field("descripcion")} rows={3} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
      </div>
    </div>
  );
}
