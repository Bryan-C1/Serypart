// src/features/Auth/hooks/useForm.js
import { useState } from "react";

export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const reset = () => setValues(initialValues);

  return { values, setValues, handleChange, reset };
}