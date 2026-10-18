// src/features/Auth/hooks/useTogglePassword.js
import { useCallback, useState } from "react";

export function useTogglePassword() {
  const [visible, setVisible] = useState(false);
  const toggle = useCallback(() => setVisible((v) => !v), []);
  return { visible, toggle, type: visible ? "text" : "password" };
}