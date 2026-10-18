export const onlyLetters = (value) => value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]/g, "");

export const onlyDigits = (value) => value.replace(/\D/g, "");

export const onlyDecimal = (value) => {
  const normalized = value.replace(/[^\d.]/g, "");
  const [whole, ...decimals] = normalized.split(".");
  return decimals.length ? `${whole}.${decimals.join("")}` : whole;
};

export const onlyPhone = (value) => value.replace(/[^\d+()\s-]/g, "");

export const onlyPlate = (value) => value.replace(/[^A-Za-z0-9-]/g, "").toUpperCase();

export const onlyNit = (value) => value.replace(/[^\d-]/g, "");

const getValidationMessage = (field) => {
  if (field.validity.valueMissing) return "Este campo es obligatorio.";
  if (field.validity.typeMismatch) {
    return field.type === "email" ? "Ingresa un correo electrónico válido." : "Ingresa un valor válido.";
  }
  if (field.validity.patternMismatch) return "El formato ingresado no es válido.";
  if (field.validity.rangeUnderflow) return `El valor mínimo permitido es ${field.min}.`;
  if (field.validity.rangeOverflow) return `El valor máximo permitido es ${field.max}.`;
  if (field.validity.stepMismatch) return "Ingresa un valor válido.";
  return "El valor ingresado no es válido.";
};

export const reportInvalidField = (root = document) => {
  const fields = [...root.querySelectorAll("input, select, textarea")];
  fields.forEach((field) => field.setCustomValidity(""));
  const invalidField = fields.find((field) => !field.checkValidity());
  if (!invalidField) return true;
  invalidField.setCustomValidity(getValidationMessage(invalidField));
  return invalidField.reportValidity();
};
