import { Search, Filter } from "lucide-react";
import { ViewToggle } from "./ViewToggle";
import { FilterOptionsList } from "../../../../shared/ui/filter-options-list";

export function SearchFilterBar({
  searchTerm, onSearchChange, filterEstado, onFilterEstadoChange,
  showFilter, onToggleFilter, onClearFilters, viewMode, onViewModeChange,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="search"
          placeholder="Buscar servicios..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="relative">
        <button
          onClick={() => onToggleFilter(!showFilter)}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
        >
          <Filter className="w-5 h-5" />
          Filtros {filterEstado !== "todos" && <span className="w-2 h-2 bg-primary rounded-full" />}
        </button>
        {showFilter && (
          <div className="absolute right-0 top-full z-10 mt-2 w-40 shadow-lg">
            <FilterOptionsList
              value={filterEstado}
              onChange={onFilterEstadoChange}
              onSelect={() => onToggleFilter(false)}
              options={["todos", "activo", "inactivo", "anulados"].map((estado) => ({
                value: estado,
                label: estado === "todos" ? "Todos" : estado === "anulados" ? "Anulados" : estado.charAt(0).toUpperCase() + estado.slice(1),
              }))}
            />
            <button
              onClick={onClearFilters}
              className="mt-1 w-full rounded-lg border border-border bg-popover px-3 py-2 text-left text-sm text-primary hover:bg-accent"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
      <ViewToggle viewMode={viewMode} onChange={onViewModeChange} />
    </div>
  );
}
