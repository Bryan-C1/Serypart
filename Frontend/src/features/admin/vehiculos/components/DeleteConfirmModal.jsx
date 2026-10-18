export function DeleteConfirmModal({ deleteId, onCancel, onConfirm }) {
  if (deleteId === null) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-sm w-full p-6">
        <h2 className="text-lg font-semibold mb-2">Anular vehículo</h2>
        <p className="text-muted-foreground mb-6">
          ¿Estás seguro de que deseas anular este vehículo? Podrás consultarlo desde el filtro de anulados.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(deleteId)}
            className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/80 transition-colors"
          >
            Anular
          </button>
        </div>
      </div>
    </div>
  );
}
