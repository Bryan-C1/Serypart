// src/features/Auth/pages/Registro.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, User, Phone } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";
import { AuthHeading } from "../components/AuthHeading";
import { FormSection } from "../components/FormSection";
import { BackToHomeLink } from "../components/BackToHomeLink";
import { FeaturesAside } from "../components/FeaturesAside";
import { TextField } from "../components/TextField";
import { PasswordField } from "../components/PasswordField";
import { SubmitButton } from "../components/SubmitButton";
import { Checkbox } from "../components/Checkbox";
import { useForm } from "../hooks/useForm";
import { onlyDigits, onlyLetters } from "../../../shared/utils/inputValidation";
import { CURRENT_USER_STORAGE_KEY } from "../../../shared/utils/currentUser";
import { apiRequest, AUTH_TOKEN_STORAGE_KEY } from "../../../shared/services/api";

export default function Registro() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { values, handleChange } = useForm({
    nombreCompleto: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    aceptaTerminos: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (values.password !== values.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!values.aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    const telefono = values.telefono.replace(/\D/g, "");
    if (telefono.length !== 10) {
      setError("El teléfono debe tener exactamente 10 dígitos.");
      return;
    }

    setSubmitting(true);
    let cuentaCreada = false;
    const [nombre, ...apellidoPartes] = values.nombreCompleto.trim().split(/\s+/);
    const email = values.email.trim();

    try {
      if (telefono.length !== 10) {
        throw new Error("El teléfono debe tener exactamente 10 dígitos.");
      }
      await apiRequest("/auth/register", {
        method: "POST",
        authenticated: false,
        body: {
          nombre,
          apellido: apellidoPartes.join(" ") || undefined,
          email,
          contraseña: values.password,
          telefono,
        },
      });
      cuentaCreada = true;

      const result = await apiRequest("/auth/login", {
        method: "POST",
        authenticated: false,
        body: { email, contraseña: values.password },
      });
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, result.token);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify({
        id_usuario: result.usuario.id_usuario,
        name: `${result.usuario.nombre} ${result.usuario.apellido || ""}`.trim(),
        email: result.usuario.email,
        phone: result.usuario.telefono || "",
        role: result.usuario.rol,
      }));
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(cuentaCreada
        ? `La cuenta fue creada, pero no se pudo iniciar sesión: ${requestError.message}`
        : requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout aside={<FeaturesAside />} maxWidth="max-w-2xl">
      <AuthHeading
        title="Crear Cuenta"
        subtitle="Completa el formulario para registrar tu taller mecánico"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="Información Personal" icon={User}>
          <TextField
            id="nombreCompleto"
            name="nombreCompleto"
            label="Nombre Completo"
            icon={User}
            value={values.nombreCompleto}
            onChange={(e) => handleChange({ target: { name: e.target.name, value: onlyLetters(e.target.value) } })}
            placeholder="Juan Pérez"
            required
          />
          <TextField
            id="telefono"
            name="telefono"
            type="tel"
            label="Teléfono"
            icon={Phone}
            value={values.telefono}
            onChange={(e) => handleChange({ target: { name: e.target.name, value: onlyDigits(e.target.value).slice(0, 10) } })}
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            placeholder="0412123456"
            required
          />
          <TextField
            id="email"
            name="email"
            type="email"
            label="Correo Electrónico"
            icon={Mail}
            value={values.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            hint='Incluye un signo "@"'
            required
            wrapperClassName="md:col-span-2"
          />
        </FormSection>

        <FormSection title="Seguridad" icon={Lock}>
          <PasswordField
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            minLength={8}
            hint="Mínimo 8 caracteres"
          />
          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirmar Contraseña"
            value={values.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </FormSection>

        <Checkbox
          id="aceptaTerminos"
          name="aceptaTerminos"
          align="start"
          checked={values.aceptaTerminos}
          onChange={handleChange}
          required
        >
          Acepto los{" "}
          <Link to="/terminos" className="text-auth-primary hover:underline">
            términos y condiciones
          </Link>{" "}
          y la{" "}
          <Link to="/privacidad" className="text-auth-primary hover:underline">
            política de privacidad
          </Link>
        </Checkbox>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <SubmitButton disabled={submitting}>
          {submitting ? "Creando cuenta..." : "Crear Cuenta"}
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-auth-primary hover:underline font-medium">
          Inicia sesión aquí
        </Link>
      </p>

      <BackToHomeLink />
    </AuthLayout>
  );
}