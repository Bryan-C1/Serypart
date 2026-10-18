export function DetailField({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}
