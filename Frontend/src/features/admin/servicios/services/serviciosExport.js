import { downloadExcelFile } from "../../../../shared/utils/excelExport.js";
import { getTipoVehiculoNombre } from "./serviciosData.js";

export function exportServiciosToExcel(servicios) {
  const headers = [
    "ID servicio",
    "Código",
    "Código padre",
    "ID servicio padre",
    "Nombre",
    "Descripción",
    "Precio",
    "Duración estimada",
    "ID tipo de vehículo",
    "Categoría",
    "Estado",
    "Foto",
  ];
  const rows = servicios.map((servicio) => [
    servicio.id,
    servicio.codigo,
    servicio.codigo_padre,
    servicio.id_servicio_padre,
    servicio.nombre,
    servicio.descripcion,
    servicio.precio,
    servicio.duracion_estimada,
    servicio.id_tipo_vehiculo,
    getTipoVehiculoNombre(servicio.id_tipo_vehiculo),
    servicio.estado === "anulado" ? "Anulado" : servicio.estado === "activo" ? "Activo" : "Inactivo",
    servicio.foto || servicio.imagen,
  ]);
  downloadExcelFile({ fileName: "servicios.xlsx", sheetName: "Servicios", headers, rows });
}
