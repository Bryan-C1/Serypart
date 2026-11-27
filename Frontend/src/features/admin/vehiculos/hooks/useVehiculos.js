import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { emptyForm, guardarVehiculos } from "../services/vehiculosData";
import { getClientesActivos } from "../../clientes/services/clientesService";
import { createVehiculo, getTiposVehiculo, getVehiculos, updateVehiculo } from "../services/vehiculosService";

function hasSelection(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

export function useVehiculos() {
  const [searchParams] = useSearchParams();
  const clienteId = searchParams.get("cliente");
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vehiculosError, setVehiculosError] = useState("");
  const [tiposError, setTiposError] = useState("");
  const [actionError, setActionError] = useState("");
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [tiposVehiculoLoading, setTiposVehiculoLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = viewMode === "cards" ? 6 : 10;

  const [modal, setModal] = useState("none");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosLoading, setUsuariosLoading] = useState(true);
  const [usuariosError, setUsuariosError] = useState("");

  const loadUsuarios = useCallback(async () => {
    setUsuariosLoading(true);
    setUsuariosError("");
    try {
      const clients = await getClientesActivos();
      setUsuarios(clients.map((client) => ({
        id_cliente: client.id,
        nombre: [client.nombre, client.apellido].filter(Boolean).join(" "),
        estado: client.estado,
      })));
    } catch (error) {
      setUsuariosError(error.message);
    } finally {
      setUsuariosLoading(false);
    }
  }, []);

  const loadVehiculos = useCallback(async () => {
    setLoading(true);
    setVehiculosError("");
    try {
      const rows = await getVehiculos();
      setVehiculos(rows);
      guardarVehiculos(rows);
    } catch (requestError) {
      setVehiculosError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTiposVehiculo = useCallback(async () => {
    setTiposVehiculoLoading(true);
    setTiposError("");
    try {
      const rows = await getTiposVehiculo();
      setTiposVehiculo(rows);
      setForm((current) => (
        current.id_tipo_vehiculo
          ? current
          : { ...current, id_tipo_vehiculo: rows[0]?.id || "" }
      ));
    } catch (requestError) {
      setTiposError(requestError.message);
    } finally {
      setTiposVehiculoLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsuarios();
    loadVehiculos();
    loadTiposVehiculo();
  }, [loadUsuarios, loadVehiculos, loadTiposVehiculo]);

  const filteredVehiculos = vehiculos.filter((v) => {
    const matchSearch =
      v.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.marca || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.modelo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(v.id_marca).includes(searchTerm) ||
      String(v.id_modelo).includes(searchTerm);
    const matchEstado = filterEstado === "anulados"
      ? v.estado === "anulado"
      : filterEstado === "todos"
        ? v.estado !== "anulado"
        : v.estado === filterEstado;
    const matchCliente = !clienteId || String(v.id_cliente) === clienteId;
    return matchSearch && matchEstado && matchCliente;
  });

  const sortedVehiculos = [...filteredVehiculos].sort((a, b) => {
    const comparison = (a.placa || "").localeCompare(b.placa || "");
    return sortDirection === "asc" ? comparison : -comparison;
  });
  const totalPages = Math.max(Math.ceil(filteredVehiculos.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVehiculos = sortedVehiculos.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const stats = {
    total: vehiculos.length,
    enServicio: vehiculos.filter((v) => v.estado === "en_servicio").length,
    activos: vehiculos.filter((v) => v.estado === "activo").length,
    inactivos: vehiculos.filter((v) => v.estado === "inactivo").length,
  };

  function openCrear() {
    setForm({ ...emptyForm, id_tipo_vehiculo: tiposVehiculo[0]?.id || "" });
    setModal("crear");
  }

  function openEditar(v) {
    setSelected(v);
    setForm({ ...v });
    setModal("editar");
  }

  function openVer(v) {
    setSelected(v);
    setModal("ver");
  }

  function closeModal() {
    setModal("none");
    setSelected(null);
  }

  async function handleGuardar() {
    if (
      !/^[A-Z]{3}-[0-9]{3}$/.test(form.placa)
      || !hasSelection(form.id_cliente)
      || !hasSelection(form.id_marca)
      || !hasSelection(form.id_modelo)
      || !hasSelection(form.id_tipo_vehiculo)
    ) return;
    setActionError("");
    try {
      let savedVehicle;
      if (modal === "crear") {
        savedVehicle = await createVehiculo(form);
      } else if (modal === "editar" && selected) {
        savedVehicle = await updateVehiculo(selected.id, form);
      }
      await loadVehiculos();
      closeModal();
      return savedVehicle;
    } catch (requestError) {
      setActionError(requestError.message);
      return null;
    }
  }

  async function handleEliminar(id) {
    setActionError("");
    try {
      const vehicle = vehiculos.find((item) => item.id === id);
      if (!vehicle || vehicle.estado === "anulado") return;
      await updateVehiculo(id, { ...vehicle, estado: "anulado" });
      await loadVehiculos();
      setDeleteId(null);
    } catch (requestError) {
      setActionError(requestError.message);
    }
  }

  async function handleToggleEstado(id, estado) {
    const vehicle = vehiculos.find((item) => item.id === id);
    if (!vehicle) return;
    setActionError("");
    try {
      await updateVehiculo(id, {
        ...vehicle,
        estado: estado || (vehicle.estado === "inactivo" ? "activo" : "inactivo"),
      });
      await loadVehiculos();
    } catch (requestError) {
      setActionError(requestError.message);
    }
  }

  function handleSearchChange(value) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  function handleFilterChange(value) {
    setFilterEstado(value);
    setCurrentPage(1);
  }

  function handleViewModeChange(nextMode) {
    setViewMode(nextMode);
    setCurrentPage(1);
  }

  function handleSortToggle() {
    setSortDirection((current) => current === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  }

  async function handleExportarExcel() {
    setActionError("");
    try {
      const { default: ExcelJS } = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Vehículos", {
        views: [{ state: "frozen", ySplit: 1 }],
      });
      worksheet.columns = [
        { header: "Tipo de vehículo", key: "tipoVehiculo", width: 22 },
        { header: "Placa", key: "placa", width: 16 },
        { header: "Cliente", key: "cliente", width: 28 },
        { header: "Marca", key: "marca", width: 20 },
        { header: "Modelo", key: "modelo", width: 22 },
        { header: "Color", key: "color", width: 18 },
        { header: "Año", key: "anio", width: 12 },
        { header: "Estado", key: "estado", width: 16 },
        { header: "Fecha de registro", key: "fechaRegistro", width: 20 },
      ];
      worksheet.addRows(sortedVehiculos.map((vehiculo) => ({
        tipoVehiculo: vehiculo.tipo_vehiculo || "",
        placa: vehiculo.placa,
        cliente: vehiculo.nombre_cliente || "",
        marca: vehiculo.marca || "",
        modelo: vehiculo.modelo || "",
        color: vehiculo.color || "",
        anio: vehiculo.año || "",
        estado: vehiculo.estado === "anulado"
          ? "Anulado"
          : vehiculo.estado === "en_servicio"
            ? "En Servicio"
            : vehiculo.estado === "inactivo"
              ? "Inactivo"
              : "Activo",
        fechaRegistro: vehiculo.fecha_registro || "",
      })));

      worksheet.eachRow({ includeEmpty: true }, (row) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = { horizontal: "left", vertical: "middle" };
        });
      });
      const header = worksheet.getRow(1);
      header.height = 24;
      header.font = { bold: true, color: { argb: "FFFFFFFF" } };
      header.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF334155" },
      };
      worksheet.autoFilter = { from: "A1", to: `I${worksheet.rowCount}` };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "vehiculos.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (exportError) {
      setActionError(`No se pudo exportar el archivo de vehículos: ${exportError.message}`);
    }
  }

  return {
    searchTerm, setSearchTerm, filterEstado, setFilterEstado, showFilter, setShowFilter, viewMode, setViewMode,
    sortDirection,
    clienteId,
    loading, error: [vehiculosError, tiposError, usuariosError, actionError].filter(Boolean).join(" "),
    actionError, tiposError,
    loadVehiculos, loadTiposVehiculo, tiposVehiculo, tiposVehiculoLoading,
    usuarios, usuariosLoading, usuariosError, loadUsuarios,
    modal, selected, form, setForm, deleteId, setDeleteId,
    filteredVehiculos, stats, currentPage, setCurrentPage, totalPages, startIndex, endIndex, paginatedVehiculos,
    openCrear, openEditar, openVer, closeModal, handleGuardar, handleEliminar, handleToggleEstado,
    handleSearchChange, handleFilterChange, handleViewModeChange, handleSortToggle, handleExportarExcel,
  };
}
