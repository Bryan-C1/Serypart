// src/features/Auth/components/PasswordField.jsx
import { Lock, Eye, EyeOff } from "lucide-react";
import { TextField } from "./TextField";
import { useTogglePassword } from "../hooks/useTogglePassword";

export function PasswordField({ label = "Contraseña", ...props }) {
  const { visible, toggle, type } = useTogglePassword();

  return (
    <TextField
      label={label}
      icon={Lock}
      type={type}
      rightSlot={
        <button
          type="button"
          onClick={toggle}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      }
      {...props}
    />
  );
}