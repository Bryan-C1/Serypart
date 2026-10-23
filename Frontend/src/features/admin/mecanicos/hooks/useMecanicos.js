import { useEffect, useRef, useState } from "react";
import { createMecanico, getMecanicos, updateMecanico } from "../services/mecanicosService";
import { emptyForm, formatHorariosPorDia, normalizeHorariosPorDia } from "../services/mecanicosData";

const itemsPerPage = 10;

export function useMecanicos() {
  const [mecanicos, setMecanicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const savingRef = useRef(false);
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

  const loadMecanicos = async () => {
    setLoading(true);
    setError("");
    try {
      setMecanicos(await getMecanicos());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMecanicos();
  }, []);

  const runMutation = async (operation, showPageError = false) => {
    if (savingRef.current) return null;
    savingRef.current = true;
    setSaving(true);
    setFormError("");
    if (showPageError) setError("");
    try {
      return await operation();
    } catch (requestError) {
      if (showPageError) setError(requestError.message);
      else setFormError(requestError.message);
      return null;
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

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

  const handleNuevo = () => { setFormError(""); setFormData(emptyForm); setShowModal(true); };

  const handleGuardarNuevo = async () => {
    if (!formData.nombre.trim()) return;
    const horarios = normalizeHorariosPorDia(formData.horariosPorDia ?? formData.horarioDisponibilidad);
    const created = await runMutation(() => createMecanico(formData));
    if (!created) return;
  setMecanicos((current) => [...current, {
    ...created,
    horariosPorDia: horarios,
    horarioDisponibilidad: formatHorariosPorDia(horarios),
  }]);
    setShowModal(false);
  };

  const handleVerDetalles = (m) => { setSelectedMecanico(m); setShowDetailModal(true); };

  const handleEditar = (m) => {
    setFormError("");
    setSelectedMecanico(m);
    setFormData({ ...m, apellido: m.apellido ?? "", tipoDocumento: m.tipoDocumento ?? "V", numeroDocumento: m.numeroDocumento ?? "", notas: m.notas ?? "" });
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleGuardarEdicion = async () => {
    if (!selectedMecanico || !formData.nombre.trim()) return;
    const horarios = normalizeHorariosPorDia(formData.horariosPorDia ?? formData.horarioDisponibilidad);
    const data = { ...formData, estado: selectedMecanico.estado === "anulado" ? "anulado" : formData.estado };
    const updated = await runMutation(() => updateMecanico(selectedMecanico.id, data));
    if (!updated) return;
  const updatedWithSchedule = {
    ...updated,
    horariosPorDia: horarios,
    horarioDisponibilidad: formatHorariosPorDia(horarios),
  };
  setMecanicos((current) => current.map((m) => m.id === updated.id ? updatedWithSchedule : m));
  setSelectedMecanico(updatedWithSchedule);
    setShowEditModal(false);
  };

  const handleAnular = (m) => { setFormError(""); setSelectedMecanico(m); setShowAnularModal(true); };

  const handleConfirmarAnular = async () => {
    if (!selectedMecanico) return;
    const updated = await runMutation(() => updateMecanico(selectedMecanico.id, { ...selectedMecanico, estado: "anulado" }));
    if (!updated) return;
    setMecanicos((current) => current.map((m) => m.id === updated.id ? updated : m));
    setShowAnularModal(false);
  };

  const handleToggleEstado = async (m, estado) => {
    if (!m) return;
    if (m.estado === "anulado" && estado === "activo") {
      await handleReactivar(m);
      return;
    }
    const updated = await runMutation(() => updateMecanico(m.id, {
      ...m,
      estado: estado || (m.estado === "activo" ? "inactivo" : "activo"),
    }), true);
    if (updated) setMecanicos((current) => current.map((mec) => mec.id === updated.id ? updated : mec));
  };
  const handleReactivar = async (m) => {
    if (!m) return;
    const updated = await runMutation(() => updateMecanico(m.id, { ...m, estado: "activo" }));
    if (!updated) return;
    setMecanicos((current) => current.map((mecanico) => mecanico.id === updated.id ? updated : mecanico));
    if (filterEstado === "anulados") setFilterEstado("todos");
    setCurrentPage(1);
  };
  const closeAll = () => {
    setFormError("");
    setShowModal(false); setShowDetailModal(false);
    setShowEditModal(false); setShowAnularModal(false);
    setSelectedMecanico(null);
  };

  return {
    searchTerm, filterEstado, filterEspecialidad, showFilters, setShowFilters, sortBy,
    loading, saving, error, formError, loadMecanicos,
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
