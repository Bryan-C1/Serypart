import { Search, Filter, ArrowDown, ArrowUp, Download } from "lucide-react";
import { ViewToggle } from "./ViewToggle";
import { tiposVehiculo } from "../services/serviciosData";

export function SearchFilterBar({
  searchTerm, onSearchChange, filterEstado, onFilterEstadoChange,
  filterCategoria, onFilterCategoriaChange, filterPrecioMin, onFilterPrecioMinChange,
  filterPrecioMax, onFilterPrecioMaxChange,
  sortDirection, onSortDirectionChange, onExport,
  showFilter, onToggleFilter, onClearFilters, viewMode, onViewModeChange,
}) {
  const hasActiveFilters = searchTerm !== "" || filterEstado !== "todos"
    || filterCategoria !== "todos" || filterPrecioMin !== "" || filterPrecioMax !== ""
    || sortDirection !== "asc";

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="search"
          placeholder="Filtrar por nombre..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => onToggleFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filtros {hasActiveFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
          </button>
          {showFilter && (
            <div className="absolute right-0 top-full z-10 mt-2 w-72 rounded-lg border border-border bg-popover p-4 shadow-lg">
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  Categoría
                  <select
                    value={filterCategoria}
                    onChange={(e) => onFilterCategoriaChange(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-input-background px-3 py-2 font-normal"
                  >
                    <option value="todos">Todas las categorías</option>
                    {tiposVehiculo.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium">
                  Estado
                  <select
                    value={filterEstado}
                    onChange={(e) => onFilterEstadoChange(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-input-background px-3 py-2 font-normal"
                  >
                    <option value="todos">Todos</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="anulados">Anulados</option>
                  </select>
                </label>
                <fieldset>
                  <legend className="mb-1 text-sm font-medium">Rango de precios</legend>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-xs text-muted-foreground">
                      Mínimo
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={filterPrecioMin}
                        onChange={(e) => onFilterPrecioMinChange(e.target.value)}
                        placeholder="Sin mínimo"
                        className="mt-1 w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground"
                      />
                    </label>
                    <label className="text-xs text-muted-foreground">
                      Máximo
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={filterPrecioMax}
                        onChange={(e) => onFilterPrecioMaxChange(e.target.value)}
                        placeholder="Sin máximo"
                        className="mt-1 w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground"
                      />
                    </label>
                  </div>
                </fieldset>
              </div>
              <button
                onClick={onClearFilters}
                className="mt-3 w-full rounded-lg border border-border bg-popover px-3 py-2 text-left text-sm text-primary hover:bg-accent"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc")}
          aria-label={`Cambiar a orden ${sortDirection === "asc" ? "descendente" : "ascendente"} por nombre`}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 hover:bg-accent transition-colors"
        >
          {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          <span>{sortDirection === "asc" ? "Ascendente" : "Descendente"}</span>
        </button>
        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 hover:bg-accent transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Exportar Excel</span>
        </button>
      </div>
      <ViewToggle viewMode={viewMode} onChange={onViewModeChange} />
    </div>
  );
}
