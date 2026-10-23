import { apiRequest } from "../../../../shared/services/api";

const tiposVehiculoPermitidos = ["Automóvil", "Camioneta", "Deportivo"];

function normalizeName(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase();
}

function fromApi(vehiculo) {
  return {
    ...vehiculo,
    id: Number(vehiculo.id_vehiculo),
    id_cliente: Number(vehiculo.id_cliente),
    id_usuario: vehiculo.id_usuario == null ? null : Number(vehiculo.id_usuario),
    id_marca: Number(vehiculo.id_marca),
    id_modelo: Number(vehiculo.id_modelo),
    id_tipo_vehiculo: Number(vehiculo.id_tipo_vehiculo),
    año: Number(vehiculo.anio),
    nombre_cliente: [vehiculo.cliente_nombre, vehiculo.cliente_apellido].filter(Boolean).join(" "),
    marca: vehiculo.marca || "",
    modelo: vehiculo.modelo || "",
    tipo_vehiculo: vehiculo.tipo_vehiculo || "",
    nombre: [vehiculo.placa, vehiculo.marca, vehiculo.modelo].filter(Boolean).join(" "),
  };
}

function toApi(vehiculo, includeFechaRegistro = true) {
  return {
    id_cliente: Number(vehiculo.id_cliente),
    placa: vehiculo.placa,
    id_marca: Number(vehiculo.id_marca),
    id_modelo: Number(vehiculo.id_modelo),
    anio: Number(vehiculo.año ?? vehiculo.anio),
    color: vehiculo.color || "",
    id_tipo_vehiculo: Number(vehiculo.id_tipo_vehiculo),
    estado: vehiculo.estado,
    ...(includeFechaRegistro && {
      fecha_registro: vehiculo.fecha_registro || new Date().toISOString().slice(0, 10),
    }),
  };
}

export async function getVehiculos() {
  const rows = await apiRequest("/vehiculos");
  if (!Array.isArray(rows)) throw new Error("La API devolvió un formato inválido para los vehículos.");
  return rows.map(fromApi);
}

export async function getTiposVehiculo() {
  const rows = await apiRequest("/tipos-vehiculo");
  if (!Array.isArray(rows)) throw new Error("La API devolvió un formato inválido para los tipos de vehículo.");

  const tiposDisponibles = rows.map((tipo) => ({
    id: Number(tipo.id_tipo_vehiculo),
    nombre: tipo.nombre,
  }));

  for (const nombre of tiposVehiculoPermitidos) {
    const tipo = tiposDisponibles.find((item) => normalizeName(item.nombre) === normalizeName(nombre));
    if (tipo) continue;

    const creado = await apiRequest("/tipos-vehiculo", {
      method: "POST",
      body: { nombre, descripcion: "Tipo de vehículo disponible en el formulario de vehículos." },
    });
    if (!creado?.id_tipo_vehiculo) throw new Error(`No se pudo registrar el tipo de vehículo ${nombre}.`);
    tiposDisponibles.push({ id: Number(creado.id_tipo_vehiculo), nombre });
  }

  return tiposVehiculoPermitidos.map((nombre) => ({
    id: tiposDisponibles.find((tipo) => normalizeName(tipo.nombre) === normalizeName(nombre)).id,
    nombre,
  }));
}

export async function createVehiculo(vehiculo) {
  return fromApi(await apiRequest("/vehiculos", {
    method: "POST",
    body: toApi(vehiculo),
  }));
}

export async function updateVehiculo(id, vehiculo) {
  return fromApi(await apiRequest(`/vehiculos/${id}`, {
    method: "PUT",
    body: toApi(vehiculo, false),
  }));
}
