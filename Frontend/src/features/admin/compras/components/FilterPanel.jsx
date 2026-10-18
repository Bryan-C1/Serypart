import { categorias } from "../services/comprasData";
import { FilterOptionsList } from "../../../../shared/ui/filter-options-list";

const ESTADOS = ["todos", "recibida", "en_transito", "pendiente", "cancelada", "anulados"];

export function FilterPanel({ filterEstado, onFilterEstadoChange, filterCategoria, onFilterCategoriaChange, onClear }) {
  return (
    <div className="grid w-[min(20rem,calc(100vw-2rem))] grid-cols-2 gap-2 rounded-lg border border-border bg-popover p-2 shadow-lg">
      <FilterOptionsList
        className="w-full"
        value={filterEstado}
        onChange={onFilterEstadoChange}
        options={ESTADOS.map((opt) => ({ value: opt, label: opt === "todos" ? "Todos" : opt === "recibida" ? "Recibidas" : opt === "en_transito" ? "En Tránsito" : opt === "pendiente" ? "Pendientes" : opt === "anulados" ? "Anulados" : "Canceladas" }))}
      />
      <FilterOptionsList
        className="w-full"
        value={filterCategoria}
        onChange={onFilterCategoriaChange}
        options={[
          { value: "todas", label: "Todas" },
          ...categorias.map((categoria) => ({ value: categoria, label: categoria })),
        ]}
      />
      <button type="button" onClick={onClear} className="col-span-2 rounded-lg border-t border-border px-3 py-2 text-left text-sm text-primary hover:bg-accent">
        Limpiar filtros
      </button>
    </div>
  );
}
