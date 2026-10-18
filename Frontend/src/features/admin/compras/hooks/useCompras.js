import { useState } from "react";
import { initialCompras, emptyForm } from "../services/comprasData";

const itemsPerPage = 8;

export function useCompras() {
  const [compras, setCompras] = useState(initialCompras);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterCategoria, setFilterCategoria] = useState("todas");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnularModal, setShowAnularModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = compras.filter((c) => {
    const matchSearch =
      String(c.id_compra).includes(searchTerm) ||
      String(c.id_proveedor ?? "").includes(searchTerm) ||
      c.fecha_compra.includes(searchTerm);
    const matchEstado = filterEstado === "todos"
      ? c.estado !== "cancelada"
      : filterEstado === "anulados"
        ? c.estado === "cancelada"
        : c.estado === filterEstado;
    const matchCategoria = filterCategoria === "todas" || c.categoria === filterCategoria;
    return matchSearch && matchEstado && matchCategoria;
  });

  const totalPages = Math.max(Math.ceil(filtered.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCompras = filtered.slice(startIndex, endIndex);

  const totalGastado = compras.filter((c) => c.estado === "recibida").reduce((a, c) => a + c.total, 0);
  const stats = {
    total: compras.length,
    recibidas: compras.filter((c) => c.estado === "recibida").length,
    pendientes: compras.filter((c) => c.estado === "pendiente" || c.estado === "en_transito").length,
    gasto: totalGastado,
  };

  const handleNuevo = () => { setFormData(emptyForm); setShowModal(true); };
  const handleGuardarNuevo = () => {
    if (!formData.id_proveedor) return;
    const newId = Math.max(...compras.map((c) => c.id_compra)) + 1;
    setCompras([...compras, { ...formData, id_compra: newId }]);
    setShowModal(false);
  };
  const handleVerDetalles = (c) => { setSelected(c); setShowDetailModal(true); };
  const handleEditar = (c) => {
    setSelected(c);
    setFormData({ id_compra: c.id_compra, id_proveedor: c.id_proveedor ?? "", fecha_compra: c.fecha_compra ?? "", total: c.total, estado: c.estado, items: c.items ?? [] });
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleGuardarEdicion = () => {
    if (!selected || !formData.id_proveedor) return;
    setCompras(compras.map((c) => (c.id_compra === selected.id_compra ? { ...formData, estado: c.estado === "cancelada" ? "cancelada" : formData.estado, id_compra: c.id_compra } : c)));
    setShowEditModal(false);
  };
  const handleAnular = (c) => { setSelected(c); setShowAnularModal(true); };
  const handleConfirmarAnular = () => {
    if (!selected) return;
    setCompras(compras.map((c) => c.id_compra === selected.id_compra ? { ...c, estado: "cancelada" } : c));
    setShowAnularModal(false);
  };
  const handleCambiarEstado = (compra, estado) => {
    setCompras((current) => current.map((item) => item.id_compra === compra.id_compra
      ? { ...item, estado }
      : item));
    if (compra.estado === "cancelada" && filterEstado === "anulados") setFilterEstado("todos");
    setCurrentPage(1);
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

  const handleFilterCategoriaChange = (value) => {
    setFilterCategoria(value);
    setCurrentPage(1);
  };

  return {
    compras, searchTerm, setSearchTerm, filterEstado, setFilterEstado,
    filterCategoria, setFilterCategoria, showFilters, setShowFilters,
    showModal, showDetailModal, showEditModal, showAnularModal, selected, formData, setFormData,
    filtered, stats, currentPage, setCurrentPage, totalPages, startIndex, endIndex, paginatedCompras,
    handleNuevo, handleGuardarNuevo, handleVerDetalles, handleEditar,
    handleGuardarEdicion, handleAnular, handleConfirmarAnular, handleCambiarEstado, closeAll, clearFilters,
    handleSearchChange, handleFilterEstadoChange, handleFilterCategoriaChange,
  };
}
