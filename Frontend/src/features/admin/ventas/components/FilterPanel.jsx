import { FilterOptionsList } from "../../../../shared/ui/filter-options-list";

const ESTADOS = ["todos", "pagada", "pendiente", "credito", "anulados"];

export function FilterPanel({ filterEstado, onFilterEstadoChange, filterMetodo, onFilterMetodoChange, metodosPago = [], onClear }) {
  return (
    <div className="grid w-[min(20rem,calc(100vw-2rem))] grid-cols-2 gap-2 rounded-lg border border-border bg-popover p-2 shadow-lg">
      <FilterOptionsList
        className="w-full"
        value={filterEstado}
        onChange={onFilterEstadoChange}
        options={ESTADOS.map((opt) => ({ value: opt, label: opt === "todos" ? "Todos" : opt === "pagada" ? "Pagadas" : opt === "pendiente" ? "Pendientes" : opt === "credito" ? "A Crédito" : "Anuladas" }))}
      />
      <FilterOptionsList
        className="w-full"
        value={filterMetodo}
        onChange={onFilterMetodoChange}
        options={[
          { value: "todos", label: "Todos" },
          ...metodosPago.map((metodo) => ({ value: String(metodo.id), label: metodo.nombre })),
        ]}
      />
      <button type="button" onClick={onClear} className="col-span-2 rounded-lg border-t border-border px-3 py-2 text-left text-sm text-primary hover:bg-accent">
        Limpiar filtros
      </button>
    </div>
  );
}
