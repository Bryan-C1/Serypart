export function StatusConfirmModal({
  item,
  entityName,
  isActive,
  onCancel,
  onConfirm,
  actionText,
  actionLabel,
  title,
  reasonRequired = false,
  reasonValue = "",
  onReasonChange,
  errorMessage = "",
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
        {reasonRequired && (
          <label className="mb-6 block text-sm font-medium">
            Motivo de anulación <span className="text-destructive">*</span>
            <textarea
              value={reasonValue}
              onChange={(event) => onReasonChange(event.target.value)}
              maxLength={500}
              rows={3}
              required
              placeholder="Escribe el motivo de la anulación..."
              className="mt-2 w-full rounded-lg border border-border bg-input-background px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        )}
        {errorMessage && (
          <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {errorMessage}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 transition-colors hover:bg-accent">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={reasonRequired && !reasonValue.trim()}
            className={`rounded-lg px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isActive ? "bg-destructive hover:bg-destructive/80" : "bg-success hover:bg-success/80"}`}>
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}
