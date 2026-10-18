import { FilterOptionsList } from "../../../../shared/ui/filter-options-list";

const ESTADOS = ["todos", "activo", "pendiente", "inactivo", "anulados"];

export function FilterPanel({ filterEstado, onFilterEstadoChange, onSelect, onClear }) {
  return (
    <div className="w-40 rounded-lg border border-border bg-popover p-1 shadow-lg">
      <FilterOptionsList
        className="border-0 bg-transparent p-0"
        value={filterEstado}
        onChange={onFilterEstadoChange}
        onSelect={onSelect}
        options={ESTADOS.map((opt) => ({ value: opt, label: opt === "todos" ? "Todos" : opt === "activo" ? "Activos" : opt === "pendiente" ? "Pendientes" : opt === "inactivo" ? "Inactivos" : "Anulados" }))}
      />
      <button type="button" onClick={() => { onClear(); onSelect?.(); }} className="mt-1 w-full rounded-lg border-t border-border px-3 py-2 text-left text-sm text-primary hover:bg-accent">
        Limpiar filtros
      </button>
    </div>
  );
}
