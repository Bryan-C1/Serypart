const DEFAULT_API_BASE_URLS = [
  import.meta.env.VITE_API_URL,
  "http://127.0.0.1:3000/api",
  "http://localhost:3000/api",
].filter(Boolean).map((value) => value.replace(/\/+$/, ""));

const API_BASE_URLS = [...new Set(DEFAULT_API_BASE_URLS)];

export const AUTH_TOKEN_STORAGE_KEY = "serypart.authToken";

async function fetchWithFallback(path, options) {
  let lastError = null;

  for (const baseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}${path}`, options);
      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("No fue posible conectar con el servidor.");
}

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
    response = await fetchWithFallback(path, {
      method,
      headers,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("No fue posible conectar con el servidor. Verifica que la API esté disponible o inicia el backend en http://localhost:3000.");
    }
    throw error;
  }

  if (response.status === 204) return null;

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("La API respondió con un formato inválido.");
  }

  if (!response.ok) {
    throw new Error(data.message || `Error del servidor (${response.status}).`);
  }

  return data;
}
