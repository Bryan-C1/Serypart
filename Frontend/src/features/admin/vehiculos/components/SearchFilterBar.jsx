import { Search, Filter, Download, ArrowUp, ArrowDown } from "lucide-react";
import { ViewToggle } from "./ViewToggle";
import { FilterOptionsList } from "../../../../shared/ui/filter-options-list";

const FILTER_OPTIONS = ["todos", "activo", "en_servicio", "inactivo", "anulados"];

export function SearchFilterBar({ searchTerm, onSearchChange, filterEstado, onFilterChange, showFilter, onToggleFilter, viewMode, onViewModeChange, sortDirection, onSortToggle, onExport }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="search"
          placeholder="Buscar por placa, marca o modelo..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <button
        type="button"
        onClick={onSortToggle}
        aria-label={`Ordenar por placa de forma ${sortDirection === "asc" ? "ascendente" : "descendente"}`}
        title={`Orden por placa ${sortDirection === "asc" ? "ascendente" : "descendente"}`}
        className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
      >
        {sortDirection === "asc" ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
        {sortDirection === "asc" ? "Ascendente" : "Descendente"}
      </button>
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
              onChange={onFilterChange}
              onSelect={() => onToggleFilter(false)}
              options={FILTER_OPTIONS.map((option) => ({
                value: option,
                label: option === "todos" ? "Todos" : option === "en_servicio" ? "En Servicio" : option === "anulados" ? "Anulados" : option.charAt(0).toUpperCase() + option.slice(1),
              }))}
            />
          </div>
        )}
      </div>
      <ViewToggle viewMode={viewMode} onChange={onViewModeChange} />
      <button
        type="button"
        onClick={onExport}
        className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
      >
        <Download className="w-5 h-5" />
        Exportar Excel
      </button>
    </div>
  );
}
