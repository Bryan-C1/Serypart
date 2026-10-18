import { ArrowRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { searchAllRecords } from "../services/globalSearchService";

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (query.trim().length < 2) {
      setResults([]);
      setError("");
      setLoading(false);
      return () => { active = false; };
    }

    setLoading(true);
    searchAllRecords(query).then((response) => {
      if (!active) return;
      setResults(response.results);
      setError(response.error);
      setLoading(false);
    });

    return () => { active = false; };
  }, [query]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Búsqueda global</h1>
        <p className="mt-1 text-muted-foreground">Encuentra clientes, vehículos, servicios, citas y más.</p>
      </div>

      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="relative rounded-xl border border-border bg-card p-4 shadow-sm"
      >
        <Search className="absolute left-7 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => setSearchParams(event.target.value ? { q: event.target.value } : {})}
          placeholder="Buscar en todo el sistema..."
          aria-label="Buscar en todo el sistema"
          className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-ring"
          autoFocus
        />
      </form>

      {query.trim().length >= 2 && <p className="text-sm text-muted-foreground">{results.length} resultados para “{query}”</p>}
      {error && <p role="alert" className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm">{error} Se muestran los ejemplos locales disponibles.</p>}
      {loading ? (
        <p className="py-10 text-center text-muted-foreground">Buscando...</p>
      ) : results.length ? (
        <div className="space-y-3">
          {results.map((record) => (
            <Link
              key={`${record.type}:${record.id}`}
              to={`/busqueda/detalle/${record.type}/${record.id}`}
              state={{ record }}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/60"
            >
              <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">{record.label}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{record.title}</span>
                {record.subtitle && <span className="mt-1 block truncate text-sm text-muted-foreground">{record.subtitle}</span>}
              </span>
              {record.source === "example" && <span className="text-xs text-muted-foreground">Ejemplo</span>}
              <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
                Ver detalle <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      ) : query.trim().length >= 2 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
          No se encontraron resultados para “{query}”.
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
          Escribe al menos dos caracteres para buscar.
        </div>
      )}
    </div>
  );
}
