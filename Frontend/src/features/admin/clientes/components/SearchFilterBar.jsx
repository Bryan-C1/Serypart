import { Search, ArrowUpDown, Filter, Download } from "lucide-react";
import { SearchableSelect } from "../../../../shared/ui/searchable-select";

export function SearchFilterBar({ searchTerm, onSearchChange, sortBy, onSortChange, showFilters, onToggleFilters, filterContent }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="search"
          placeholder="Buscar por nombre, email o cédula..."
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
          textClassName="text-foreground"
          className="sort-filter-select appearance-none pl-10 pr-10 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer hover:bg-accent transition-colors"
        >
          <option value="nombre-asc">Nombre A-Z</option>
          <option value="nombre-desc">Nombre Z-A</option>
          <option value="vehiculos-asc">Menos vehículos</option>
          <option value="vehiculos-desc">Más vehículos</option>
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
        {showFilters && filterContent && <div className="absolute right-0 top-full z-50 mt-2">{filterContent}</div>}
      </div>
      <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
        <Download className="w-5 h-5" />
        Exportar
      </button>
    </div>
  );
}
