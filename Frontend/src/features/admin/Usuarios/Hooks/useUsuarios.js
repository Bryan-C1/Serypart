import { useCallback, useEffect, useState } from "react";
import { getUsuarios, createUsuario, updateUsuario } from "../Services/usuariosService";

const itemsPerPage = 10;

const emptyForm = {
  nombre: "",
  apellido: "",
  tipo_documento: "",
  numero_documento: "",
  direccion: "",
  email: "",
  contraseña: "",
  telefono: "",
  estado: "activo",
  id_rol: "",
};

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
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
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadUsuarios = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsuarios();
  }, [loadUsuarios]);

  const filteredUsuarios = usuarios.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      `${u.nombre} ${u.apellido}`.toLowerCase().includes(term) ||
      (u.email || "").toLowerCase().includes(term) ||
      (u.numero_documento || "").includes(searchTerm);
    const matchEstado = filterEstado === "anulados"
      ? u.estado === "anulado"
      : filterEstado === "todos"
        ? u.estado !== "anulado"
        : u.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
    const nombreA = `${a.nombre} ${a.apellido}`;
    const nombreB = `${b.nombre} ${b.apellido}`;
    return sortBy === "nombre-desc" ? nombreB.localeCompare(nombreA) : nombreA.localeCompare(nombreB);
  });

  const totalPages = Math.max(Math.ceil(sortedUsuarios.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsuarios = sortedUsuarios.slice(startIndex, endIndex);

  const stats = {
    total: usuarios.length,
    activos: usuarios.filter((u) => u.estado !== "inactivo" && u.estado !== "anulado").length,
    inactivos: usuarios.filter((u) => u.estado === "inactivo").length,
    conRol: usuarios.filter((u) => u.id_rol).length,
  };

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
  };

  const openCreate = () => {
    setFormData(emptyForm);
    setSelectedUsuario(null);
    setShowModal(true);
  };

  const openEdit = (usuario) => {
    setSelectedUsuario(usuario);
    setFormData({ ...emptyForm, ...usuario, contraseña: "" });
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const openVerDetalles = (usuario) => {
    setSelectedUsuario(usuario);
    setShowDetailModal(true);
  };

  const openEliminar = (usuario) => {
    setSelectedUsuario(usuario);
    setShowDeleteModal(true);
  };

  const handleGuardarNuevo = async () => {
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.email.trim() || !formData.id_rol) {
      setError("Completa los campos obligatorios para crear el usuario.");
      return;
    }
    setError("");
    try {
      await createUsuario(formData);
      await loadUsuarios();
      setShowModal(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleGuardarEdicion = async () => {
    if (!selectedUsuario || !formData.nombre.trim() || !formData.apellido.trim()) {
      setError("Completa los campos obligatorios para guardar los cambios.");
      return;
    }
    setError("");
    try {
      await updateUsuario(selectedUsuario.id_usuario, formData);
      await loadUsuarios();
      setShowEditModal(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleConfirmarEliminar = async () => {
    if (!selectedUsuario) return;
    setError("");
    try {
      await updateUsuario(selectedUsuario.id_usuario, { estado: "anulado" });
      await loadUsuarios();
      setShowDeleteModal(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleToggleEstado = async (usuario, estado) => {
    if (!usuario) return;
    const nuevoEstado = estado || (usuario.estado === "anulado" || usuario.estado === "inactivo" ? "activo" : "inactivo");
    setError("");
    try {
      await updateUsuario(usuario.id_usuario, { estado: nuevoEstado });
      if (usuario.estado === "anulado" && filterEstado === "anulados") {
        setFilterEstado("todos");
        setCurrentPage(1);
      }
      await loadUsuarios();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const closeAll = () => {
    setShowModal(false);
    setShowDetailModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedUsuario(null);
  };

  return {
    usuarios, loading, error, searchTerm, filterEstado, showFilters, setShowFilters, sortBy,
    currentPage, setCurrentPage, totalPages, startIndex, endIndex,
    sortedUsuarios, paginatedUsuarios, stats,
    showModal, showDetailModal, showEditModal, showDeleteModal,
    selectedUsuario, formData, setFormData,
    handleSearchChange, handleFilterChange, handleSortChange, clearFilters,
    openCreate, openEdit, openVerDetalles, openEliminar,
    handleGuardarNuevo, handleGuardarEdicion, handleConfirmarEliminar,
    handleToggleEstado, loadUsuarios, closeAll,
  };
}
