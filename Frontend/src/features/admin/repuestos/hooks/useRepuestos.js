import { useState } from "react";
import {
  initialRepuestos,
  emptyForm,
  marcasRepuesto,
} from "../services/repuestosData";

const itemsPerPage = 8;

export function useRepuestos() {
  const [repuestos, setRepuestos] = useState(initialRepuestos);
  const [marcas, setMarcas] = useState(marcasRepuesto);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [showFilter, setShowFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMarcaModal, setShowMarcaModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAnularModal, setShowAnularModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRepuesto, setSelectedRepuesto] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const filteredRepuestos = repuestos.filter(repuesto => {
    const matchSearch =
      repuesto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repuesto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filterEstado === "todos"
      ? repuesto.estado !== "anulado"
      : filterEstado === "anulados"
        ? repuesto.estado === "anulado"
        : repuesto.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const totalPages = Math.max(
    Math.ceil(filteredRepuestos.length / itemsPerPage),
    1,
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRepuestos = filteredRepuestos.slice(startIndex, endIndex);

  const lowStockCount = repuestos.filter(
    r => r.estado === "bajo_stock" || r.estado === "agotado",
  ).length;

  const calcularEstado = (stock, minStock) => {
    if (stock === 0) return "agotado";
    if (stock <= minStock) return "bajo_stock";
    return "disponible";
  };

  const handleNuevo = () => {
    setFormData(emptyForm);
    setShowModal(true);
  };

  const handleGuardarNuevo = () => {
    if (!formData.nombre.trim()) return;
    const newId = Math.max(...repuestos.map(r => r.id_repuesto)) + 1;
    const estado = calcularEstado(formData.stock, formData.stock_minimo);
    setRepuestos([...repuestos, { ...formData, id_repuesto: newId, estado }]);
    setShowModal(false);
  };

  const handleVerDetalles = repuesto => {
    setSelectedRepuesto(repuesto);
    setShowDetailModal(true);
  };

  const handleEditar = repuesto => {
    setSelectedRepuesto(repuesto);
    setFormData({
      nombre: repuesto.nombre,
      descripcion: repuesto.descripcion,
      id_marca_repuesto: repuesto.id_marca_repuesto,
      precio_unitario: repuesto.precio_unitario,
      stock: repuesto.stock,
      stock_minimo: repuesto.stock_minimo,
      estado: repuesto.estado,
    });
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleCambiarEstado = (repuesto, estado) => {
    if (!repuesto || repuesto.estado === "anulado") return;
    setRepuestos(
      repuestos.map(item =>
        item.id_repuesto === repuesto.id_repuesto ? { ...item, estado } : item,
      ),
    );
  };
  const handleReactivar = (repuesto) => {
    const estado = calcularEstado(repuesto.stock, repuesto.stock_minimo);
    setRepuestos((current) => current.map((item) => item.id_repuesto === repuesto.id_repuesto
      ? { ...item, estado }
      : item));
    if (filterEstado === "anulados") setFilterEstado("todos");
    setCurrentPage(1);
  };

  const handleGuardarEdicion = () => {
    if (!selectedRepuesto || !formData.nombre.trim()) return;
    setRepuestos(
      repuestos.map(r =>
        r.id_repuesto === selectedRepuesto.id_repuesto
          ? { ...formData, estado: r.estado === "anulado" ? "anulado" : formData.estado, id_repuesto: r.id_repuesto }
          : r,
      ),
    );
    setShowEditModal(false);
  };

  const handleAnular = repuesto => {
    setSelectedRepuesto(repuesto);
    setShowAnularModal(true);
  };

  const handleConfirmarAnular = () => {
    if (!selectedRepuesto) return;
    setRepuestos(
      repuestos.map(r => r.id_repuesto === selectedRepuesto.id_repuesto ? { ...r, estado: "anulado" } : r),
    );
    setShowAnularModal(false);
  };

  const closeAll = () => {
    setShowModal(false);
    setShowAnularModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setSelectedRepuesto(null);
  };

  const getMarcaNombre = id =>
    marcas.find(m => m.id === Number(id))?.nombre || "—";

  const handleAgregarMarca = nombre => {
    if (!nombre.trim()) return;
    const newId = marcas.length ? Math.max(...marcas.map(m => m.id)) + 1 : 1;
    setMarcas([...marcas, { id: newId, nombre: nombre.trim() }]);
    setShowMarcaModal(false);
  };

  const handleSearchChange = value => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = value => {
    setFilterEstado(value);
    setCurrentPage(1);
  };

  return {
    repuestos,
    marcas,
    getMarcaNombre,
    searchTerm,
    setSearchTerm,
    filteredRepuestos,
    lowStockCount,
    filterEstado,
    showFilter,
    setShowFilter,
    showModal,
    showMarcaModal,
    setShowMarcaModal,
    showAnularModal,
    showEditModal,
    showDetailModal,
    selectedRepuesto,
    formData,
    setFormData,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    endIndex,
    paginatedRepuestos,
    handleNuevo,
    handleGuardarNuevo,
    handleVerDetalles,
    handleEditar,
    handleCambiarEstado,
    handleReactivar,
    handleGuardarEdicion,
    handleAnular,
    handleConfirmarAnular,
    handleAgregarMarca,
    closeAll,
    handleSearchChange,
    handleFilterChange,
  };
}
