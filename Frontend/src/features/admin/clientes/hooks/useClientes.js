import { useCallback, useEffect, useState } from "react";
import { emptyForm } from "../services/clientesData";
import { createCliente, getClientes, updateCliente } from "../services/clientesService";

const itemsPerPage = 10;

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("nombre-asc");
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
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cedula.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filterEstado === "anulados"
      ? c.estado === "anulado"
      : filterEstado === "todos"
        ? c.estado !== "anulado"
        : c.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const sortedClientes = [...filteredClientes].sort((a, b) => {
    switch (sortBy) {
      case "nombre-asc":
        return a.nombre.localeCompare(b.nombre);
      case "nombre-desc":
        return b.nombre.localeCompare(a.nombre);
      case "vehiculos-asc":
        return a.vehiculos - b.vehiculos;
      case "vehiculos-desc":
        return b.vehiculos - a.vehiculos;
      default:
        return 0;
    }
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

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    handleFilterChange("todos");
    handleSearchChange("");
    setSortBy("nombre-asc");
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
      const actualizado = await updateCliente(selectedCliente.id, { ...selectedCliente, estado: "anulado" });
      setClientes((current) => current.map((item) => item.id === actualizado.id
        ? { ...item, ...actualizado, vehiculos: item.vehiculos, ultimaVisita: item.ultimaVisita }
        : item));
      setSelectedCliente(actualizado);
      setShowDeleteModal(false);
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
    searchTerm, filterEstado, showFilters, setShowFilters, sortBy, loading, error, loadClientes,
    currentPage, setCurrentPage, totalPages, startIndex, endIndex,
    sortedClientes, paginatedClientes, stats,
    showModal, showDetailModal, showEditModal, showDeleteModal,
    selectedCliente, formData, setFormData,
    handleSearchChange, handleFilterChange, handleSortChange, clearFilters,
    handleNuevo, handleGuardarNuevo, handleVerDetalles, handleEditar,
    handleGuardarEdicion, handleEliminar, handleConfirmarEliminar,
    handleToggleEstado, closeAll,
  };
}
