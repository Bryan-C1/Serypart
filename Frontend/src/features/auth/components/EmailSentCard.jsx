// src/features/Auth/components/EmailSentCard.jsx
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export function EmailSentCard({ email, onResend }) {
  return (
    <div className="bg-card border border-border rounded-lg p-8 text-center">
      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-success" />
      </div>

      <h2 className="text-2xl font-bold mb-3">¡Correo Enviado!</h2>
      <p className="text-muted-foreground mb-6">
        Hemos enviado un enlace de recuperación de contraseña a <strong>{email}</strong>
      </p>

      <div className="bg-accent/50 border border-border rounded-lg p-4 mb-6">
        <p className="text-sm text-muted-foreground">
          Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
          Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
        </p>
      </div>

      <div className="space-y-3">
        <Link
          to="/login"
          className="w-full block py-3 bg-auth-primary text-auth-primary-foreground rounded-lg hover:bg-auth-secondary transition-colors font-medium text-center"
        >
          Volver al Inicio de Sesión
        </Link>

        <button
          onClick={onResend}
          className="w-full py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
        >
          Enviar Nuevamente
        </button>
      </div>
    </div>
  );
}