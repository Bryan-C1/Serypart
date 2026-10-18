const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/+$/, "");

export const AUTH_TOKEN_STORAGE_KEY = "serypart.authToken";

export async function apiRequest(path, { method = "GET", body, authenticated = true } = {}) {
  const headers = new Headers({ Accept: "application/json" });
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (body !== undefined && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("No fue posible conectar con el servidor. Verifica que la API esté disponible.");
    }
    throw error;
  }

  if (response.status === 204) return null;

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Error del servidor (${response.status}).`);
  }

  return data;
}
