import { useState } from "react";
import { initialProveedores, emptyForm } from "../services/proveedoresData";

const itemsPerPage = 8;

export function useProveedores() {
  const [proveedores, setProveedores] = useState(initialProveedores);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnularModal, setShowAnularModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = proveedores.filter((p) => {
    const matchSearch =
      p.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filterEstado === "todos"
      ? p.estado !== "anulado"
      : filterEstado === "anulados"
        ? p.estado === "anulado"
        : p.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const totalPages = Math.max(Math.ceil(filtered.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProveedores = filtered.slice(startIndex, endIndex);

  const stats = {
    total: proveedores.length,
    activos: proveedores.filter((p) => p.estado === "activo").length,
    pendientes: proveedores.filter((p) => p.estado === "pendiente").length,
    inactivos: proveedores.filter((p) => p.estado === "inactivo").length,
  };

  const handleNuevo = () => { setFormData(emptyForm); setShowModal(true); };
  const handleGuardarNuevo = () => {
    if (!formData.nombre_empresa.trim()) return;
    const newId = Math.max(...proveedores.map((p) => p.id_proveedor)) + 1;
    setProveedores([...proveedores, { ...formData, id_proveedor: newId }]);
    setShowModal(false);
  };
  const handleVerDetalles = (p) => { setSelected(p); setShowDetailModal(true); };
  const handleEditar = (p) => {
    setSelected(p);
    setFormData({ ...p });
    setShowDetailModal(false);
    setShowEditModal(true);
  };
  const handleGuardarEdicion = () => {
    if (!selected || !formData.nombre_empresa.trim()) return;
    setProveedores(proveedores.map((p) => (p.id_proveedor === selected.id_proveedor ? { ...formData, estado: p.estado === "anulado" ? "anulado" : formData.estado, id_proveedor: p.id_proveedor } : p)));
    setShowEditModal(false);
  };
  const handleToggleEstado = (p, estado) => {
    if (!p) return;
    if (p.estado === "anulado" && estado === "activo") {
      handleReactivar(p);
      return;
    }
    setProveedores(proveedores.map((prov) =>
      prov.id_proveedor === p.id_proveedor
        ? { ...prov, estado: estado || (prov.estado === "activo" ? "inactivo" : "activo") }
        : prov
    ));
  };
  const handleReactivar = (p) => {
    setProveedores((current) => current.map((proveedor) => proveedor.id_proveedor === p.id_proveedor
      ? { ...proveedor, estado: "activo" }
      : proveedor));
    if (filterEstado === "anulados") setFilterEstado("todos");
    setCurrentPage(1);
  };
  const handleAnular = (p) => { setSelected(p); setShowAnularModal(true); };
  const handleConfirmarAnular = () => {
    if (!selected) return;
    setProveedores(proveedores.map((p) => p.id_proveedor === selected.id_proveedor ? { ...p, estado: "anulado" } : p));
    setShowAnularModal(false);
  };
  const closeAll = () => { setShowModal(false); setShowDetailModal(false); setShowEditModal(false); setShowAnularModal(false); setSelected(null); };
  const clearFilters = () => {
    setFilterEstado("todos");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterEstadoChange = (value) => {
    setFilterEstado(value);
    setCurrentPage(1);
  };

  return {
    proveedores, searchTerm, setSearchTerm, filterEstado, setFilterEstado,
    showFilters, setShowFilters,
    showModal, showDetailModal, showEditModal, showAnularModal, selected, formData, setFormData,
    filtered, stats, currentPage, setCurrentPage, totalPages, startIndex, endIndex, paginatedProveedores,
    handleNuevo, handleGuardarNuevo, handleVerDetalles, handleEditar,
    handleGuardarEdicion, handleAnular, handleConfirmarAnular, handleToggleEstado, handleReactivar, closeAll, clearFilters,
    handleSearchChange, handleFilterEstadoChange,
  };
}
