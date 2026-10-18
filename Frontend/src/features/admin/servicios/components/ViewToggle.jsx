import { LayoutGrid, List } from "lucide-react";

export function ViewToggle({ viewMode, onChange }) {
  return (
    <div className="flex items-center border border-border rounded-lg overflow-hidden shrink-0">
      <button
        onClick={() => onChange("cards")}
        className={`p-2 transition-colors ${viewMode === "cards" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
        title="Vista de tarjetas"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
      <button
        onClick={() => onChange("table")}
        className={`p-2 transition-colors ${viewMode === "table" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
        title="Vista de tabla"
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
}
