// src/features/Auth/pages/Registro.jsx
import { Link, useNavigate } from "react-router-dom";
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
import { onlyLetters, onlyPhone } from "../../../shared/utils/inputValidation";
import { CURRENT_USER_STORAGE_KEY } from "../../../shared/utils/currentUser";

export default function Registro() {
  const navigate = useNavigate();
  const { values, handleChange } = useForm({
    nombreCompleto: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    aceptaTerminos: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (values.password !== values.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    if (!values.aceptaTerminos) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }
    localStorage.setItem(
      CURRENT_USER_STORAGE_KEY,
      JSON.stringify({
        name: values.nombreCompleto,
        email: values.email,
        phone: values.telefono,
        password: values.password,
      }),
    );
    navigate("/dashboard");
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
            pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+"
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
            onChange={(e) => handleChange({ target: { name: e.target.name, value: onlyPhone(e.target.value) } })}
            pattern="[0-9+()\s-]+"
            placeholder="+58 412-1234567"
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

        <SubmitButton>Crear Cuenta</SubmitButton>
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