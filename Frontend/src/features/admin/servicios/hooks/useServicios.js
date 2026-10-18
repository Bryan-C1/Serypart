import { useCallback, useEffect, useState } from "react";
import { emptyForm } from "../services/serviciosData";
import { createServicio, getServicios, updateServicio } from "../services/serviciosService";

export function useServicios() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = viewMode === "cards" ? 6 : 10;

  const [modal, setModal] = useState("none");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);

  const loadServicios = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setServicios(await getServicios());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServicios();
  }, [loadServicios]);

  const filteredServicios = servicios.filter((s) => {
    const matchSearch =
      s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filterEstado === "anulados"
      ? s.estado === "anulado"
      : filterEstado === "todos"
        ? s.estado !== "anulado"
        : s.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const totalPages = Math.max(Math.ceil(filteredServicios.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServicios = filteredServicios.slice(startIndex, endIndex);

  const stats = {
    total: servicios.length,
    precioPromedio: servicios.length ? servicios.reduce((acc, s) => acc + s.precio, 0) / servicios.length : 0,
    activos: servicios.filter((s) => s.estado === "activo").length,
  };

  function openCrear() {
    setForm(emptyForm);
    setModal("crear");
  }

  function openEditar(s) {
    setSelected(s);
    setForm({ nombre: s.nombre, descripcion: s.descripcion, precio: s.precio, duracion_estimada: s.duracion_estimada, estado: s.estado, id_tipo_vehiculo: s.id_tipo_vehiculo, imagen: s.imagen || "", imagenArchivo: null });
    setModal("editar");
  }

  function openVer(s) {
    setSelected(s);
    setModal("ver");
  }

  function closeModal() {
    setModal("none");
    setSelected(null);
  }

  async function handleToggleEstado(id, estado) {
    const servicio = servicios.find((item) => item.id === id);
    if (!servicio) return;
    setError("");
    try {
      const actualizado = await updateServicio(id, {
        ...servicio,
        estado: estado || (servicio.estado === "inactivo" ? "activo" : "inactivo"),
      });
      setServicios((prev) => prev.map((item) => item.id === id ? actualizado : item));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleGuardar() {
    if (!form.nombre || !form.precio || saving) return;
    setSaving(true);
    setError("");
    try {
      if (modal === "crear") {
        const creado = await createServicio(form);
        setServicios((prev) => [creado, ...prev]);
      } else if (modal === "editar" && selected) {
        const actualizado = await updateServicio(selected.id, form);
        setServicios((prev) => prev.map((item) => item.id === selected.id ? actualizado : item));
      }
      closeModal();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleEliminar(id) {
    setError("");
    try {
      const servicio = servicios.find((item) => item.id === id);
      if (!servicio || servicio.estado === "anulado") return;
      const actualizado = await updateServicio(id, { ...servicio, estado: "anulado" });
      setServicios((prev) => prev.map((item) => item.id === id ? actualizado : item));
      setDeleteId(null);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function clearFilters() {
    setFilterEstado("todos");
    setShowFilter(false);
    setCurrentPage(1);
  }

  function handleSearchChange(value) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  function handleFilterEstadoChange(value) {
    setFilterEstado(value);
    setCurrentPage(1);
  }

  function handleViewModeChange(nextMode) {
    setViewMode(nextMode);
    setCurrentPage(1);
  }

  return {
    searchTerm, setSearchTerm, filterEstado, setFilterEstado, loading, saving, error, loadServicios,
    showFilter, setShowFilter, viewMode, setViewMode, modal, selected, form, setForm, deleteId, setDeleteId,
    filteredServicios, stats, currentPage, setCurrentPage, totalPages, startIndex, endIndex, paginatedServicios,
    openCrear, openEditar, openVer, closeModal, handleToggleEstado, handleGuardar, handleEliminar, clearFilters,
    handleSearchChange, handleFilterEstadoChange, handleViewModeChange,
  };
}
