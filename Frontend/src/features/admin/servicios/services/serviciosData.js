import { Wrench } from "lucide-react";

export const initialServicios = [
  { id: 1, nombre: "Cambio de Aceite", descripcion: "Cambio de aceite y filtro", precio: 45, duracion_estimada: "45 min", estado: "activo", id_tipo_vehiculo: 1 },
  { id: 2, nombre: "Alineación y Balanceo", descripcion: "Alineación de dirección y balanceo de ruedas", precio: 80, duracion_estimada: "1.5 hrs", estado: "activo", id_tipo_vehiculo: 2 },
  { id: 3, nombre: "Cambio de Frenos", descripcion: "Cambio de pastillas y discos de freno", precio: 150, duracion_estimada: "2 hrs", estado: "activo", id_tipo_vehiculo: 1 },
  { id: 4, nombre: "Revisión de Motor", descripcion: "Diagnóstico completo del motor", precio: 120, duracion_estimada: "3 hrs", estado: "activo", id_tipo_vehiculo: 2 },
  { id: 5, nombre: "Cambio de Batería", descripcion: "Instalación de batería nueva", precio: 95, duracion_estimada: "30 min", estado: "activo", id_tipo_vehiculo: 1 },
  { id: 6, nombre: "Aire Acondicionado", descripcion: "Recarga de gas y mantenimiento A/C", precio: 110, duracion_estimada: "1 hr", estado: "activo", id_tipo_vehiculo: 2 },
];

const SERVICIOS_STORAGE_KEY = "serypart-servicios-creados";

export function getServiciosDisponibles() {
  try {
    const guardados = JSON.parse(localStorage.getItem(SERVICIOS_STORAGE_KEY) || "[]");
    return [...initialServicios, ...guardados];
  } catch {
    return [...initialServicios];
  }
}

export function guardarServicio(servicio) {
  try {
    const guardados = JSON.parse(localStorage.getItem(SERVICIOS_STORAGE_KEY) || "[]");
    localStorage.setItem(SERVICIOS_STORAGE_KEY, JSON.stringify([...guardados, servicio]));
  } catch {
    // La lista en memoria sigue funcionando si el almacenamiento no está disponible.
  }
}

export const tiposVehiculo = [
  { id: 1, nombre: "Automóvil" },
  { id: 2, nombre: "Camioneta" },
  { id: 3, nombre: "Motocicleta" },
  { id: 4, nombre: "Camión" },
];

export function getTipoVehiculoNombre(id) {
  return tiposVehiculo.find((t) => t.id === Number(id))?.nombre || "—";
}

export const emptyForm = {
  nombre: "", descripcion: "", precio: 0, duracion_estimada: "", estado: "activo", id_tipo_vehiculo: 1, imagen: "", imagenArchivo: null,
};

export const servicioIcono = Wrench;

export const servicioImagenes = {
  1: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  2: "https://images.unsplash.com/photo-1645445522156-9ac06bc7a767?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  3: "https://images.unsplash.com/photo-1613214150384-14921ff659b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  4: "https://images.unsplash.com/photo-1599082267768-4815b2ea6bd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  5: "https://images.unsplash.com/photo-1764122623556-90a7d480df53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  6: "https://images.unsplash.com/photo-1656232976683-7b688560e427?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
};
