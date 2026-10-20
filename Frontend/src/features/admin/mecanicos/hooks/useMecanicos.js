import { useState } from "react";
import { initialMecanicos, emptyForm, formatHorariosPorDia, normalizeHorariosPorDia } from "../services/mecanicosData";

const itemsPerPage = 10;

export function useMecanicos() {
  const [mecanicos, setMecanicos] = useState(initialMecanicos);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterEspecialidad, setFilterEspecialidad] = useState("todas");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("nombre-asc");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnularModal, setShowAnularModal] = useState(false);

  const [selectedMecanico, setSelectedMecanico] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = mecanicos.filter((m) => {
    const matchSearch =
      m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.especialidad.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filterEstado === "todos"
      ? m.estado !== "anulado"
      : filterEstado === "anulados"
        ? m.estado === "anulado"
        : m.estado === filterEstado;
    const matchEsp = filterEspecialidad === "todas" || m.especialidad === filterEspecialidad;
    return matchSearch && matchEstado && matchEsp;
  });

  const sortedMecanicos = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "nombre-asc":
        return a.nombre.localeCompare(b.nombre);
      case "nombre-desc":
        return b.nombre.localeCompare(a.nombre);
      default:
        return 0;
    }
  });

  const totalPages = Math.max(Math.ceil(sortedMecanicos.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMecanicos = sortedMecanicos.slice(startIndex, endIndex);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterEstadoChange = (value) => {
    setFilterEstado(value);
    setCurrentPage(1);
  };

  const handleFilterEspecialidadChange = (value) => {
    setFilterEspecialidad(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    handleFilterEstadoChange("todos");
    handleFilterEspecialidadChange("todas");
    handleSearchChange("");
    setSortBy("nombre-asc");
  };

  const stats = {
    total: mecanicos.length,
    activos: mecanicos.filter((m) => m.estado === "activo").length,
    inactivos: mecanicos.filter((m) => m.estado === "inactivo" || m.estado === "vacaciones").length,
  };

  const handleNuevo = () => { setFormData(emptyForm); setShowModal(true); };

  const handleGuardarNuevo = () => {
    if (!formData.nombre.trim()) return;
    const horarios = normalizeHorariosPorDia(formData.horariosPorDia ?? formData.horarioDisponibilidad);
    const newId = Math.max(...mecanicos.map((m) => m.id)) + 1;
    setMecanicos([...mecanicos, { ...formData, id: newId, horariosPorDia: horarios, horarioDisponibilidad: formatHorariosPorDia(horarios) }]);
    setShowModal(false);
  };

  const handleVerDetalles = (m) => { setSelectedMecanico(m); setShowDetailModal(true); };

  const handleEditar = (m) => {
    setSelectedMecanico(m);
    setFormData({ ...m, apellido: m.apellido ?? "", tipoDocumento: m.tipoDocumento ?? "CC", numeroDocumento: m.numeroDocumento ?? m.cedula ?? "", notas: m.notas ?? "" });
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleGuardarEdicion = () => {
    if (!selectedMecanico || !formData.nombre.trim()) return;
    const horarios = normalizeHorariosPorDia(formData.horariosPorDia ?? formData.horarioDisponibilidad);
    setMecanicos(mecanicos.map((m) => (m.id === selectedMecanico.id ? { ...formData, estado: m.estado === "anulado" ? "anulado" : formData.estado, id: m.id, horariosPorDia: horarios, horarioDisponibilidad: formatHorariosPorDia(horarios) } : m)));
    setShowEditModal(false);
  };

  const handleAnular = (m) => { setSelectedMecanico(m); setShowAnularModal(true); };

  const handleConfirmarAnular = () => {
    if (!selectedMecanico) return;
    setMecanicos(mecanicos.map((m) => m.id === selectedMecanico.id ? { ...m, estado: "anulado" } : m));
    setShowAnularModal(false);
  };

  const handleToggleEstado = (m, estado) => {
    if (!m) return;
    if (m.estado === "anulado" && estado === "activo") {
      handleReactivar(m);
      return;
    }
    setMecanicos(mecanicos.map((mec) =>
      mec.id === m.id
        ? { ...mec, estado: estado || (mec.estado === "activo" ? "inactivo" : "activo") }
        : mec
    ));
  };
  const handleReactivar = (m) => {
    setMecanicos((current) => current.map((mecanico) => mecanico.id === m.id
      ? { ...mecanico, estado: "activo" }
      : mecanico));
    if (filterEstado === "anulados") setFilterEstado("todos");
    setCurrentPage(1);
  };
  const closeAll = () => {
    setShowModal(false); setShowDetailModal(false);
    setShowEditModal(false); setShowAnularModal(false);
    setSelectedMecanico(null);
  };

  return {
    searchTerm, filterEstado, filterEspecialidad, showFilters, setShowFilters, sortBy,
    currentPage, setCurrentPage, totalPages, startIndex, endIndex,
    sortedMecanicos, paginatedMecanicos, stats,
    showModal, showDetailModal, showEditModal, showAnularModal,
    selectedMecanico, formData, setFormData,
    handleSearchChange, handleFilterEstadoChange, handleFilterEspecialidadChange, handleSortChange, clearFilters,
    handleNuevo, handleGuardarNuevo, handleVerDetalles, handleEditar,
    handleGuardarEdicion, handleAnular, handleConfirmarAnular,
    handleToggleEstado, handleReactivar, closeAll,
  };
}
