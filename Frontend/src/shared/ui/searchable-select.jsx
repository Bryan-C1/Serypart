import { Children, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

export function SearchableSelect({
  value = "",
  onChange,
  children,
  className = "",
  disabled = false,
  disabledClassName = "disabled:cursor-not-allowed disabled:opacity-100",
  textClassName = "text-foreground",
  required = false,
  searchable = true,
  placeholder = "Seleccionar...",
  ...props
}) {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const options = useMemo(() => {
    const items = [];
    const collect = (child) => {
      if (!child) return;
      if (child.props?.value !== undefined) {
        items.push({ ...child.props, label: String(child.props.children ?? "") });
        return;
      }
      if (child.props?.children) Children.forEach(child.props.children, collect);
    };
    Children.forEach(children, collect);
    return items;
  }, [children]);
  const hasValue = String(value) !== "";
  const selected = hasValue ? options.find((option) => String(option.value) === String(value)) : null;
  const filteredOptions = options
    .filter((option) => String(option.value) !== "")
    .filter((option) => !searchable || option.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const selectOption = (option) => {
    onChange?.({ target: { value: String(option.value) } });
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`${className} flex w-full items-center justify-between gap-2 text-left ${textClassName} ${disabledClassName}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`truncate ${selected ? textClassName : `${textClassName}/80`}`}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
      </button>
      {required && !hasValue && <input tabIndex={-1} required className="absolute h-0 w-0 opacity-0" value="" onChange={() => {}} aria-label={props["aria-label"] || placeholder} />}
      {open && !disabled && (
        <div className="absolute left-0 top-full z-[70] mt-1 w-full min-w-[12rem] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg">
          {searchable && (
            <div className="flex items-center gap-2 border-b border-border px-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar..."
                className="searchable-select-search-input h-10 w-full bg-transparent text-sm outline-none"
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto p-1" role="listbox">
            {filteredOptions.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">No se encontraron opciones</p>
            ) : filteredOptions.map((option) => (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => selectOption(option)}
                className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${String(option.value) === String(value) ? "bg-primary font-medium text-primary-foreground" : "hover:bg-accent"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
