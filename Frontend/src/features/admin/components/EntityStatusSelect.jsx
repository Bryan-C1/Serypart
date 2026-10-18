import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

export const activeInactiveStatusOptions = [
  { value: "activo", label: "Activo", className: "bg-success/10 text-success" },
  { value: "inactivo", label: "Inactivo", className: "bg-muted text-muted-foreground" },
];

export const annulledStatusOption = {
  value: "anulado",
  label: "Anulado",
  disabled: true,
  hiddenFromMenu: true,
  className: "bg-muted text-muted-foreground",
};

export function EntityStatusSelect({ value, options, onChange, disabled = false, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const selected = options.find((option) => option.value === value);
  const menuOptions = options.filter((option) => !option.hiddenFromMenu);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!triggerRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("scroll", closeOnOutsideClick, true);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("scroll", closeOnOutsideClick, true);
    };
  }, [open]);

  const toggleMenu = () => {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const menuHeight = menuOptions.length * 36 + 8;
    const opensAbove = rect.bottom + menuHeight + 4 > window.innerHeight;
    setMenuPosition({
      left: Math.max(8, Math.min(rect.left, window.innerWidth - 180)),
      top: opensAbove ? Math.max(8, rect.top - menuHeight - 4) : rect.bottom + 4,
    });
    setOpen(true);
  };

  return (
    <div className="inline-flex">
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        disabled={disabled}
        onClick={toggleMenu}
        className={`inline-flex items-center gap-2 rounded-full border border-current/20 px-3 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${selected?.className || "bg-muted text-muted-foreground"}`}
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
        {selected?.label || value}
        <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && menuPosition && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[100] min-w-[9rem] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
          style={menuPosition}
          role="listbox"
        >
          {menuOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              disabled={option.disabled}
              onClick={() => {
                if (!option.disabled && value !== option.value) onChange(option.value);
                setOpen(false);
              }}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${value === option.value ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
            >
              {option.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
