import { Search, ArrowUpDown, Filter, Download } from "lucide-react";
import { especialidades } from "../services/mecanicosData";
import { SearchableSelect } from "../../../../shared/ui/searchable-select";
import { FilterOptionsList } from "../../../../shared/ui/filter-options-list";

const ESTADOS = ["todos", "activo", "inactivo", "vacaciones", "anulados"];

export function SearchSortFilterBar({
  searchTerm, onSearchChange, sortBy, onSortChange,
  showFilters, onToggleFilters, filterEstado, onFilterEstadoChange,
  filterEspecialidad, onFilterEspecialidadChange, onClearFilters,
}) {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por nombre, email, cédula o especialidad..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="relative">
          <SearchableSelect
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            searchable={false}
            className="sort-filter-select appearance-none pl-10 pr-10 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer hover:bg-accent transition-colors"
          >
            <option value="nombre-asc">Nombre A-Z</option>
            <option value="nombre-desc">Nombre Z-A</option>
          </SearchableSelect>
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground pointer-events-none" />
        </div>
        <div className="relative">
          <button
            onClick={() => onToggleFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilters ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"}`}
          >
            <Filter className="w-5 h-5" />
            Filtros
          </button>
          {showFilters && (
            <div className="absolute right-0 top-full z-50 mt-2">
              <div className="grid w-[min(20rem,calc(100vw-2rem))] grid-cols-2 gap-2 rounded-lg border border-border bg-popover p-2 shadow-lg">
                <FilterOptionsList
                  className="w-full"
                  value={filterEstado}
                  onChange={onFilterEstadoChange}
                  options={ESTADOS.map((opt) => ({
                    value: opt,
                    label: opt === "todos" ? "Todos" : opt === "activo" ? "Activos" : opt === "inactivo" ? "Inactivos" : opt === "vacaciones" ? "Vacaciones" : "Anulados",
                  }))}
                />
                <FilterOptionsList
                  className="w-full"
                  value={filterEspecialidad}
                  onChange={onFilterEspecialidadChange}
                  options={[
                    { value: "todas", label: "Todas" },
                    ...especialidades.map((especialidad) => ({ value: especialidad, label: especialidad })),
                  ]}
                />
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="col-span-2 rounded-lg border-t border-border px-3 py-2 text-left text-sm text-primary hover:bg-accent"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
          <Download className="w-5 h-5" />
          Exportar
        </button>
      </div>

    </>
  );
}
