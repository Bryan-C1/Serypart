import { useCallback, useEffect, useState } from "react";
import { emptyForm } from "../services/clientesData";
import { createCliente, deleteCliente, getClientes, updateCliente } from "../services/clientesService";

const itemsPerPage = 10;

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [showFilters, setShowFilters] = useState(false);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedCliente, setSelectedCliente] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadClientes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setClientes(await getClientes());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  const filteredClientes = clientes.filter((c) => {
    const matchSearch =
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.numeroDocumento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filterEstado === "anulados"
      ? c.estado === "anulado"
      : filterEstado === "todos"
        ? c.estado !== "anulado"
        : c.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const sortedClientes = [...filteredClientes].sort((a, b) => {
    const comparison = a.nombre.localeCompare(b.nombre);
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedClientes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClientes = sortedClientes.slice(startIndex, endIndex);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setFilterEstado(value);
    setCurrentPage(1);
  };

  const handleSortToggle = () => {
    setSortDirection((current) => current === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  const clearFilters = () => {
    handleFilterChange("todos");
    handleSearchChange("");
    setSortDirection("asc");
  };

  const handleExportarExcel = async () => {
    setError("");
    try {
      const { default: ExcelJS } = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Clientes", {
        views: [{ state: "frozen", ySplit: 1 }],
      });
      worksheet.columns = [
        { header: "Nombre", key: "nombre", width: 22 },
        { header: "Apellido", key: "apellido", width: 22 },
        { header: "Tipo de documento", key: "tipoDocumento", width: 20 },
        { header: "Número de documento", key: "numeroDocumento", width: 22 },
        { header: "Teléfono", key: "telefono", width: 18 },
        { header: "Dirección", key: "direccion", width: 32 },
        { header: "Correo electrónico", key: "email", width: 30 },
        { header: "Fecha de registro", key: "fechaRegistro", width: 20 },
        { header: "Última visita", key: "ultimaVisita", width: 18 },
        { header: "Vehículos", key: "vehiculos", width: 14 },
        { header: "Estado", key: "estado", width: 16 },
      ];
      worksheet.addRows(sortedClientes.map((cliente) => ({
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        tipoDocumento: cliente.tipoDocumento,
        numeroDocumento: cliente.numeroDocumento,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        email: cliente.email,
        fechaRegistro: cliente.fechaRegistro,
        ultimaVisita: cliente.ultimaVisita,
        vehiculos: cliente.vehiculos,
        estado: cliente.estado === "anulado" ? "Anulado" : cliente.estado === "activo" ? "Activo" : "Inactivo",
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
      worksheet.autoFilter = { from: "A1", to: `K${worksheet.rowCount}` };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "clientes.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (exportError) {
      setError(`No se pudo exportar el archivo de clientes: ${exportError.message}`);
    }
  };

  const stats = {
    total: clientes.length,
    activos: clientes.filter((c) => c.estado === "activo").length,
    inactivos: clientes.filter((c) => c.estado === "inactivo").length,
    vehiculos: clientes.reduce((acc, c) => acc + c.vehiculos, 0),
  };

  const handleNuevo = () => {
    setFormData(emptyForm);
    setShowModal(true);
  };

  const handleGuardarNuevo = async () => {
    if (
      !formData.numeroDocumento ||
      !/^\d+$/.test(formData.numeroDocumento) ||
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      (formData.telefono && !/^\d+$/.test(formData.telefono))
    ) return;
    setError("");
    try {
      const cliente = await createCliente(formData);
      setClientes((current) => [...current, cliente]);
      setShowModal(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleVerDetalles = (cliente) => {
    setSelectedCliente(cliente);
    setShowDetailModal(true);
  };

  const handleEditar = (cliente) => {
    setSelectedCliente(cliente);
    setFormData({
      ...emptyForm,
      tipoDocumento: cliente.tipoDocumento || "CC",
      numeroDocumento: cliente.numeroDocumento || String(cliente.cedula || "").replace(/\D/g, ""),
      nombre: cliente.nombre,
      apellido: cliente.apellido || "",
      telefono: cliente.telefono || "",
      direccion: cliente.direccion || "",
      estado: cliente.estado,
      email: cliente.email || "",
      fechaRegistro: cliente.fechaRegistro || "",
      cedula: cliente.cedula || "",
      vehiculos: cliente.vehiculos || 0,
      ultimaVisita: cliente.ultimaVisita || "",
    });
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleGuardarEdicion = async () => {
    if (
      !selectedCliente ||
      !formData.numeroDocumento ||
      !/^\d+$/.test(formData.numeroDocumento) ||
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      (formData.telefono && !/^\d+$/.test(formData.telefono))
    ) return;
    const numeroDocumento = formData.numeroDocumento.trim();
    const documentoDuplicado = clientes.some((cliente) =>
      cliente.id !== selectedCliente.id &&
      String(cliente.numeroDocumento || "").trim() === numeroDocumento
    );
    if (documentoDuplicado) {
      setError("Ya existe otro cliente con ese número de documento.");
      return;
    }
    setError("");
    try {
      const cliente = await updateCliente(selectedCliente.id, formData);
      setClientes((current) => current.map((item) => item.id === cliente.id
        ? { ...item, ...cliente, vehiculos: item.vehiculos, ultimaVisita: item.ultimaVisita }
        : item));
      setSelectedCliente(cliente);
      setShowEditModal(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleEliminar = (cliente) => {
    setSelectedCliente(cliente);
    setShowDeleteModal(true);
  };

  const handleConfirmarEliminar = async () => {
    if (!selectedCliente) return;
    setError("");
    try {
      await deleteCliente(selectedCliente.id);
      setClientes((current) => current.filter((item) => item.id !== selectedCliente.id));
      setCurrentPage((page) => Math.min(page, Math.max(1, Math.ceil((sortedClientes.length - 1) / itemsPerPage))));
      setShowDeleteModal(false);
      setSelectedCliente(null);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleToggleEstado = async (cliente, estado) => {
    if (!cliente) return;
    setError("");
    try {
      if (cliente.estado === "anulado" && estado === "activo") {
        const updated = await updateCliente(cliente.id, { ...cliente, estado: "activo" });
        setClientes((current) => current.map((item) => item.id === updated.id
          ? { ...item, ...updated, vehiculos: item.vehiculos, ultimaVisita: item.ultimaVisita }
          : item));
        if (filterEstado === "anulados") {
          setFilterEstado("todos");
          setCurrentPage(1);
        }
        return;
      }
      const updated = await updateCliente(cliente.id, {
        ...cliente,
        estado: estado || (cliente.estado === "inactivo" ? "activo" : "inactivo"),
      });
      setClientes((current) => current.map((item) => item.id === updated.id
        ? { ...item, ...updated, vehiculos: item.vehiculos, ultimaVisita: item.ultimaVisita }
        : item));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const closeAll = () => {
    setShowModal(false);
    setShowDetailModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedCliente(null);
  };

  return {
    searchTerm, filterEstado, showFilters, setShowFilters, sortDirection, loading, error, loadClientes,
    currentPage, setCurrentPage, totalPages, startIndex, endIndex,
    sortedClientes, paginatedClientes, stats,
    showModal, showDetailModal, showEditModal, showDeleteModal,
    selectedCliente, formData, setFormData,
    handleSearchChange, handleFilterChange, handleSortToggle, clearFilters, handleExportarExcel,
    handleNuevo, handleGuardarNuevo, handleVerDetalles, handleEditar,
    handleGuardarEdicion, handleEliminar, handleConfirmarEliminar,
    handleToggleEstado, closeAll,
  };
}
