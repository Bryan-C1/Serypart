import { useState } from "react";
import { initialRoles, emptyForm, permisosVacios } from "../Services/rolesData";

const itemsPerPage = 5;

export function useRoles() {
  const [roles, setRoles] = useState(initialRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("nombre-asc");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const filteredRoles = roles.filter((r) => {
    const matchSearch =
      r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filterEstado === "anulados"
      ? r.estado === "anulado"
      : filterEstado === "todos"
        ? r.estado !== "anulado"
        : r.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const sortedRoles = [...filteredRoles].sort((a, b) => {
    switch (sortBy) {
      case "nombre-asc":
        return a.nombre.localeCompare(b.nombre);
      case "nombre-desc":
        return b.nombre.localeCompare(a.nombre);
      case "usuarios-asc":
        return a.usuariosAsignados - b.usuariosAsignados;
      case "usuarios-desc":
        return b.usuariosAsignados - a.usuariosAsignados;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedRoles.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRoles = sortedRoles.slice(startIndex, endIndex);

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
    total: roles.length,
    activos: roles.filter((r) => r.estado === "activo").length,
    inactivos: roles.filter((r) => r.estado === "inactivo").length,
    usuarios: roles.reduce((acc, r) => acc + r.usuariosAsignados, 0),
  };

  const handleNuevo = () => {
    setFormData(emptyForm);
    setShowModal(true);
  };

  const handleGuardarNuevo = () => {
    if (!formData.nombre.trim()) return;
    const newId = roles.length ? Math.max(...roles.map((r) => r.id)) + 1 : 1;
    setRoles([...roles, { ...formData, id: newId }]);
    setShowModal(false);
  };

  const handleVerDetalles = (role) => {
    setSelectedRole(role);
    setShowDetailModal(true);
  };

  const handleEditar = (role) => {
    setSelectedRole(role);
    setFormData({
      nombre: role.nombre,
      descripcion: role.descripcion,
      estado: role.estado,
      usuariosAsignados: role.usuariosAsignados,
      permisos: role.permisos || permisosVacios(),
    });
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleGuardarEdicion = () => {
    if (!selectedRole || !formData.nombre.trim()) return;
    setRoles(roles.map((r) => (r.id === selectedRole.id ? { ...formData, id: r.id } : r)));
    setShowEditModal(false);
  };

  const handleEliminar = (role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const handleConfirmarEliminar = () => {
    if (!selectedRole) return;
    setRoles(roles.map((r) => r.id === selectedRole.id ? { ...r, estado: "anulado" } : r));
    setShowDeleteModal(false);
  };

  const handleToggleEstado = (role, estado) => {
    if (!role) return;
    setRoles(roles.map((r) =>
      r.id === role.id ? { ...r, estado: estado || (r.estado === "inactivo" ? "activo" : "inactivo") } : r
    ));
  };

  const handleExportar = () => {
    const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const headers = ["Nombre", "Descripción", "Usuarios asignados", "Estado", "Permisos activos"];
    const rows = sortedRoles.map((role) => {
      const permisosActivos = Object.entries(role.permisos || {}).flatMap(([modulo, acciones]) =>
        Object.entries(acciones)
          .filter(([, activo]) => activo)
          .map(([accion]) => `${modulo}: ${accion}`)
      );

      return [
        role.nombre,
        role.descripcion,
        role.usuariosAsignados,
        role.estado === "anulado" ? "Anulado" : role.estado === "activo" ? "Activo" : "Inactivo",
        permisosActivos.join("; "),
      ].map(escapeCsv).join(",");
    });

    const csv = [headers.map(escapeCsv).join(","), ...rows].join("\r\n");
    const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "roles.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const closeAll = () => {
    setShowModal(false);
    setShowDetailModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedRole(null);
  };

  return {
    searchTerm, filterEstado, showFilters, setShowFilters, sortBy,
    currentPage, setCurrentPage, totalPages, startIndex, endIndex,
    sortedRoles, paginatedRoles, stats,
    showModal, showDetailModal, showEditModal, showDeleteModal,
    selectedRole, formData, setFormData,
    handleSearchChange, handleFilterChange, handleSortChange, clearFilters,
    handleNuevo, handleGuardarNuevo, handleVerDetalles, handleEditar,
    handleGuardarEdicion, handleEliminar, handleConfirmarEliminar,
    handleToggleEstado, handleExportar, closeAll,
  };
}
