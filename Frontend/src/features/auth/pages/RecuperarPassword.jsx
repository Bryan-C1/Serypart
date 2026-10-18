// src/features/Auth/pages/RecuperarPassword.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";
import { AuthHeading } from "../components/AuthHeading";
import { EmailSentCard } from "../components/EmailSentCard";
import { TextField } from "../components/TextField";
import { SubmitButton } from "../components/SubmitButton";

export default function RecuperarPassword() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <AuthLayout>
        <EmailSentCard email={email} onResend={() => setEmailSent(false)} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthHeading
        title="Recuperar Contraseña"
        subtitle="Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextField
          id="email"
          type="email"
          label="Correo Electrónico"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          hint='Incluye un signo "@"'
          required
        />
        <SubmitButton>Enviar Enlace de Recuperación</SubmitButton>
      </form>

      <div className="mt-6">
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio de Sesión
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="text-auth-primary hover:underline font-medium">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}