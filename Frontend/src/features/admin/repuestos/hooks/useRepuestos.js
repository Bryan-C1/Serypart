import { useCallback, useEffect, useState } from "react";
import { emptyForm } from "../services/repuestosData";
import {
  createMarcaRepuesto,
  createRepuesto,
  getMarcasRepuesto,
  getRepuestos,
  updateRepuesto,
} from "../services/repuestosService";

const itemsPerPage = 8;

export function useRepuestos() {
  const [repuestos, setRepuestos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const loadRepuestos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [repuestoRows, marcaRows] = await Promise.all([
        getRepuestos(),
        getMarcasRepuesto(),
      ]);
      setRepuestos(repuestoRows);
      setMarcas(marcaRows);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRepuestos();
  }, [loadRepuestos]);

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
    setError("");
    setFormData(emptyForm);
    setShowModal(true);
  };

  const handleGuardarNuevo = async () => {
    if (!formData.nombre.trim()) return;
    setError("");
    try {
      const repuesto = await createRepuesto({
        ...formData,
        estado: calcularEstado(Number(formData.stock), Number(formData.stock_minimo)),
      });
      setRepuestos((current) => [...current, repuesto]);
      setShowModal(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleVerDetalles = repuesto => {
    setSelectedRepuesto(repuesto);
    setShowDetailModal(true);
  };

  const handleEditar = repuesto => {
    setError("");
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

  const handleCambiarEstado = async (repuesto, estado) => {
    if (!repuesto || repuesto.estado === "anulado") return;
    setError("");
    try {
      const updated = await updateRepuesto(repuesto.id_repuesto, { ...repuesto, estado });
      setRepuestos((current) => current.map((item) =>
        item.id_repuesto === updated.id_repuesto ? updated : item
      ));
    } catch (requestError) {
      setError(requestError.message);
    }
  };
  const handleReactivar = async (repuesto) => {
    const estado = calcularEstado(repuesto.stock, repuesto.stock_minimo);
    setError("");
    try {
      const updated = await updateRepuesto(repuesto.id_repuesto, { ...repuesto, estado });
      setRepuestos((current) => current.map((item) => item.id_repuesto === updated.id_repuesto
        ? updated
        : item));
      if (filterEstado === "anulados") setFilterEstado("todos");
      setCurrentPage(1);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleGuardarEdicion = async () => {
    if (!selectedRepuesto || !formData.nombre.trim()) return;
    setError("");
    try {
      const updated = await updateRepuesto(selectedRepuesto.id_repuesto, {
        ...formData,
        estado: selectedRepuesto.estado === "anulado" ? "anulado" : formData.estado,
      });
      setRepuestos((current) => current.map((item) =>
        item.id_repuesto === updated.id_repuesto ? updated : item
      ));
      setShowEditModal(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleAnular = repuesto => {
    setError("");
    setSelectedRepuesto(repuesto);
    setShowAnularModal(true);
  };

  const handleConfirmarAnular = async () => {
    if (!selectedRepuesto) return;
    setError("");
    try {
      const updated = await updateRepuesto(selectedRepuesto.id_repuesto, {
        ...selectedRepuesto,
        estado: "anulado",
      });
      setRepuestos((current) => current.map((item) =>
        item.id_repuesto === updated.id_repuesto ? updated : item
      ));
      setShowAnularModal(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const closeAll = () => {
    setShowModal(false);
    setShowAnularModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setSelectedRepuesto(null);
    setError("");
  };

  const getMarcaNombre = id =>
    marcas.find(m => m.id === Number(id))?.nombre || "—";

  const handleAgregarMarca = async nombre => {
    if (!nombre.trim()) {
      setError("Escribe el nombre de la marca.");
      return;
    }
    setError("");
    try {
      const marca = await createMarcaRepuesto(nombre);
      setMarcas((current) => [...current, marca]);
      setShowMarcaModal(false);
    } catch (requestError) {
      setError(requestError.message);
    }
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
    loading,
    error,
    loadRepuestos,
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
