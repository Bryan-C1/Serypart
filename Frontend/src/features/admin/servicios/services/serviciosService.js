import { apiRequest } from "../../../../shared/services/api";

function fromApi(servicio) {
  return {
    ...servicio,
    id: servicio.id_servicio,
    precio: Number(servicio.precio),
    descripcion: servicio.descripcion || "",
    duracion_estimada: servicio.duracion_estimada || "",
    id_tipo_vehiculo: Number(servicio.id_tipo_vehiculo),
    imagen: servicio.foto || "",
  };
}

function toFormData(servicio) {
  const body = new FormData();
  body.append("nombre", servicio.nombre);
  body.append("descripcion", servicio.descripcion || "");
  body.append("precio", String(servicio.precio));
  body.append("duracion_estimada", servicio.duracion_estimada || "");
  body.append("estado", servicio.estado);
  body.append("id_tipo_vehiculo", String(servicio.id_tipo_vehiculo));

  if (servicio.imagenArchivo) {
    body.append("foto", servicio.imagenArchivo);
  } else {
    body.append("foto", servicio.imagen || "");
  }
  return body;
}

export async function getServicios() {
  const servicios = await apiRequest("/servicios");
  return servicios.map(fromApi);
}

export async function createServicio(servicio) {
  return fromApi(await apiRequest("/servicios", {
    method: "POST",
    body: toFormData(servicio),
  }));
}

export async function updateServicio(id, servicio) {
  return fromApi(await apiRequest(`/servicios/${id}`, {
    method: "PUT",
    body: toFormData(servicio),
  }));
}
