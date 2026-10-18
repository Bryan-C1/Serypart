export function StatusConfirmModal({
  item,
  entityName,
  isActive,
  onCancel,
  onConfirm,
  actionText,
  actionLabel,
  title,
}) {
  if (!item) return null;

  const action = actionText || (isActive ? "desactivar" : "activar");
  const label = actionLabel || (isActive ? "Desactivar" : "Activar");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">{title || `${label} estado`}</h2>
        <p className="mb-6 text-muted-foreground">
          ¿Estás seguro de que deseas {action}{" "}
          <strong className="text-foreground">{entityName}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 transition-colors hover:bg-accent">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-white transition-colors ${isActive ? "bg-destructive hover:bg-destructive/80" : "bg-success hover:bg-success/80"}`}>
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}
