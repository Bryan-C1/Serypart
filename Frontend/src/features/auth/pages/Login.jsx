// src/features/Auth/pages/Login.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { useState } from "react";
import { AuthLayout } from "../components/AuthLayout";
import { AuthHeading } from "../components/AuthHeading";
import { BackToHomeLink } from "../components/BackToHomeLink";
import { ImageAside } from "../components/ImageAside";
import { TextField } from "../components/TextField";
import { PasswordField } from "../components/PasswordField";
import { SubmitButton } from "../components/SubmitButton";
import { Checkbox } from "../components/Checkbox";
import { useForm } from "../hooks/useForm";
import { CURRENT_USER_STORAGE_KEY } from "../../../shared/utils/currentUser";
import { apiRequest, AUTH_TOKEN_STORAGE_KEY } from "../../../shared/services/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { values, handleChange } = useForm({ email: "", password: "" });
  const [error, setError] = useState("No fue posible conectar con el servidor. Verifica que la API esté disponible.");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await apiRequest("/auth/login", {
        method: "POST",
        body: { email: values.email, contraseña: values.password },
        authenticated: false,
      });
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, result.token);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify({
        id_usuario: result.usuario.id_usuario,
        name: `${result.usuario.nombre} ${result.usuario.apellido || ""}`.trim(),
        email: result.usuario.email,
        phone: result.usuario.telefono || "",
        role: result.usuario.rol,
      }));
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout aside={<ImageAside />}>
      <AuthHeading title="Iniciar Sesión" subtitle="Ingresa a tu cuenta para continuar" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextField
          id="email"
          name="email"
          type="email"
          label="Correo Electrónico"
          icon={Mail}
          value={values.email}
          onChange={handleChange}
          placeholder="correo@ejemplo.com"
          placeholderClassName="placeholder:text-gray-400 placeholder:opacity-70"
          hint='Incluye un signo "@"'
          required
        />

        <PasswordField
          id="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="••••••••"
          placeholderClassName="placeholder:text-gray-400 placeholder:opacity-70"
          required
        />

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center justify-between gap-3">
          <Checkbox id="remember">Recordar sesión</Checkbox>
          <Link to="/recuperar-password" className="text-sm font-medium text-[#0d6efd] transition-colors hover:text-[#0b5ed7] hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <SubmitButton disabled={submitting}>{submitting ? "Iniciando sesión..." : "Iniciar Sesión"}</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-[#4b5563]">
        ¿No tienes cuenta?{" "}
        <Link to="/registro" className="font-medium text-[#0d6efd] transition-colors hover:text-[#0b5ed7] hover:underline">
          Regístrate aquí
        </Link>
      </p>

      <BackToHomeLink />
    </AuthLayout>
  );
}