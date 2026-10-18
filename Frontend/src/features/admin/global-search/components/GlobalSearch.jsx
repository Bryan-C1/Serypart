import { ArrowRight, LoaderCircle, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchAllRecords } from "../services/globalSearchService";

export function GlobalSearch() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setError("");
      setLoading(false);
      return undefined;
    }

    let active = true;
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      const response = await searchAllRecords(term);
      if (active) {
        setResults(response.results.slice(0, 8));
        setError(response.error);
        setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [query]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setFocused(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setFocused(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const openResults = () => {
    const term = query.trim();
    if (term.length < 2) return;
    setFocused(false);
    navigate(`/busqueda?q=${encodeURIComponent(term)}`);
  };

  const openRecord = (record) => {
    setFocused(false);
    navigate(`/busqueda/detalle/${record.type}/${record.id}`, { state: { record } });
  };

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1 max-w-2xl">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          openResults();
        }}
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onFocus={() => setFocused(true)}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar en todo el sistema..."
          aria-label="Buscar en todo el sistema"
          aria-expanded={focused && query.trim().length >= 2}
          className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {loading && <LoaderCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
      </form>

      {focused && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-[80] mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold">Resultados</span>
            <span className="text-xs text-muted-foreground">{results.length} encontrados</span>
          </div>
          {error && results.length === 0 ? (
            <p role="alert" className="px-4 py-5 text-sm text-destructive">{error}</p>
          ) : results.length ? (
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-border">
              {results.map((record) => (
                <button
                  key={`${record.type}:${record.id}`}
                  type="button"
                  onClick={() => openRecord(record)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent"
                >
                  <span className="mt-0.5 rounded-full bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">{record.label}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{record.title}</span>
                    {record.subtitle && <span className="mt-1 block truncate text-xs text-muted-foreground">{record.subtitle}</span>}
                  </span>
                  {record.source === "example" && <span className="text-[10px] text-muted-foreground">Ejemplo</span>}
                </button>
              ))}
            </div>
          ) : loading ? (
            <p className="px-4 py-5 text-sm text-muted-foreground">Buscando...</p>
          ) : (
            <p className="px-4 py-5 text-sm text-muted-foreground">No se encontraron coincidencias.</p>
          )}
          {error && results.length > 0 && <p className="border-t border-border px-4 py-2 text-xs text-warning">{error}</p>}
          <button
            type="button"
            onClick={openResults}
            className="flex w-full items-center justify-between border-t border-border px-4 py-3 text-sm font-medium text-primary hover:bg-accent"
          >
            Ver todos los resultados
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
