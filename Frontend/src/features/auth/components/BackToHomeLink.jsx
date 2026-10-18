// src/features/Auth/components/BackToHomeLink.jsx
import { Link } from "react-router-dom";

export function BackToHomeLink() {
  return (
    <div className="mt-8 pt-6 border-t border-border text-center">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Volver al inicio
      </Link>
    </div>
  );
}