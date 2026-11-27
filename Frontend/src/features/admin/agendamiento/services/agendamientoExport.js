import { downloadExcelFile } from "../../../../shared/utils/excelExport.js";
import { getServicioNombre, getUsuarioNombre, getVehiculoNombre, estadoLabel } from "./agendamientoData.js";
import { getMecanicoNombre } from "../../mecanicos/services/mecanicosService.js";

export function exportCitasToExcel(citas) {
  const headers = [
    "ID cita",
    "ID cliente",
    "Cliente",
    "ID vehículo",
    "Vehículo",
    "ID usuario",
    "Fecha cita",
    "Hora cita",
    "ID mecánico",
    "Mecánico",
    "IDs servicios",
    "Servicios",
    "Detalle de servicios",
    "Estado",
    "Motivo de anulación",
    "Observaciones",
    "Fecha de registro",
  ];
  const rows = citas.map((cita) => {
    const servicios = cita.servicios?.length
      ? cita.servicios
      : cita.id_servicio ? [{ id: cita.id_servicio, nombre: cita.servicio_nombre }] : [];
    return [
      cita.id,
      cita.id_cliente,
      getUsuarioNombre(cita.id_usuario, cita.nombre_cliente),
      cita.id_vehiculo,
      getVehiculoNombre(cita.id_vehiculo, cita.nombre_vehiculo),
      cita.id_usuario,
      cita.fecha_cita,
      cita.hora_cita,
      cita.id_mecanico,
      getMecanicoNombre(cita.id_mecanico),
      servicios.map((servicio) => servicio.id_servicio ?? servicio.id).join(", "),
      servicios.map((servicio) => getServicioNombre(servicio.id_servicio ?? servicio.id, servicio.nombre)).join("; "),
      servicios.map((servicio) => {
        const nombre = getServicioNombre(servicio.id_servicio ?? servicio.id, servicio.nombre);
        const descripcion = servicio.descripcion || "";
        const precio = servicio.precio == null ? "" : ` ($${servicio.precio})`;
        return `${nombre}${descripcion ? `: ${descripcion}` : ""}${precio}`;
      }).join("; "),
      estadoLabel[cita.estado] || cita.estado,
      cita.motivo_anulacion,
      cita.observaciones,
      cita.fecha_registro,
    ];
  });

  downloadExcelFile({ fileName: "citas.xlsx", sheetName: "Citas", headers, rows });
}
