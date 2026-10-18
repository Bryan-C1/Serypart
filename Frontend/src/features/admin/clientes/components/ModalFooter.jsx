import { reportInvalidField } from "../../../../shared/utils/inputValidation";

export function ModalFooter({ onCancel, onSave, saveLabel }) {
  return (
    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
      <button onClick={onCancel} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
        Cancelar
      </button>
      <button onClick={() => reportInvalidField() && onSave()} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors">
        {saveLabel}
      </button>
    </div>
  );
}
