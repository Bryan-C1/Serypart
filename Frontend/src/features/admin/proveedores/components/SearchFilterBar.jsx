import { Search, Filter, Download } from "lucide-react";

export function SearchFilterBar({ searchTerm, onSearchChange, showFilters, onToggleFilters, filterContent }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input type="search" placeholder="Buscar por empresa, cliente o NIT..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="relative">
        <button onClick={() => onToggleFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilters ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"}`}>
          <Filter className="w-5 h-5" /> Filtros
        </button>
        {showFilters && filterContent && <div className="absolute right-0 top-full z-50 mt-2">{filterContent}</div>}
      </div>
      <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
        <Download className="w-5 h-5" /> Exportar
      </button>
    </div>
  );
}
