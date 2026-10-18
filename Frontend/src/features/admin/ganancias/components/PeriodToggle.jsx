const PERIODOS = ["mes", "trimestre", "año"];

export function PeriodToggle({ periodoSeleccionado, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1">
      {PERIODOS.map((periodo) => (
        <button
          key={periodo}
          onClick={() => onChange(periodo)}
          className={`px-4 py-2 rounded-md text-sm transition-colors capitalize ${
            periodoSeleccionado === periodo
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          {periodo}
        </button>
      ))}
    </div>
  );
}
