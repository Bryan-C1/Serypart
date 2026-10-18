import { apiRequest } from "../../../../shared/services/api";

export async function getUsuarios() {
  return apiRequest("/usuarios");
}

export async function createUsuario(data) {
  return apiRequest("/usuarios", { method: "POST", body: data });
}

export async function updateUsuario(id, data) {
  const updateData = { ...data };
  if (!updateData.contraseña) delete updateData.contraseña;
  return apiRequest(`/usuarios/${id}`, { method: "PUT", body: updateData });
}
