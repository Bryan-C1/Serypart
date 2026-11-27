import { downloadExcelFile } from "../../../../shared/utils/excelExport.js";
import { estadoConfig, getMetodoPagoNombre } from "./ventasData.js";
import { getUsuarioNombre } from "../../vehiculos/services/vehiculosData.js";

export function exportVentasToExcel(ventas) {
  const headers = [
    "ID venta",
    "Cliente",
    "ID cliente",
    "Fecha de venta",
    "Mecánico asignado",
    "ID cita",
    "Método de pago",
    "Estado",
    "Total",
    "Otros conceptos no detallados",
    "Conceptos",
  ];
  const rows = ventas.map((venta) => [
    venta.id_venta,
    venta.nombre_usuario || getUsuarioNombre(venta.id_cliente),
    venta.id_cliente,
    venta.fecha_venta,
    venta.nombre_mecanico || "Sin mecánico asignado",
    venta.id_cita || "Sin cita",
    venta.nombre_metodo_pago || getMetodoPagoNombre(venta.id_metodo_pago),
    estadoConfig[venta.estado]?.label || venta.estado,
    Number(venta.total || 0),
    Number(venta.otherConceptsTotal || 0),
    (venta.items || []).map((item) => (
      `${item.tipo === "servicio" ? "Servicio" : "Repuesto"}: ${item.nombre} × ${item.cantidad} ($${Number(item.precio_unitario || 0).toFixed(2)} c/u)`
    )).join("; "),
  ]);
  downloadExcelFile({ fileName: "ventas.xlsx", sheetName: "Ventas", headers, rows });
}
