export function FilterOptionsList({
  options,
  value,
  onChange,
  onSelect,
  className = "",
}) {
  return (
    <div
      className={`flex max-h-60 flex-col gap-1 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground ${className}`}
      role="listbox"
    >
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          role="option"
          aria-selected={String(value) === String(option.value)}
          onClick={() => {
            onChange(option.value);
            onSelect?.(option.value);
          }}
          className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
            String(value) === String(option.value)
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
