import { X } from "lucide-react";

export function ModalWrapper({ title, onClose, children, maxWidth = "max-w-2xl" }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-card border border-border rounded-lg ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
