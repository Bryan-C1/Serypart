import { useCallback, useEffect, useState } from "react";
import { emptyForm } from "../services/ventasData";
import { createCita } from "../../agendamiento/services/agendamientoService";
import { createVenta, getMetodosPago, getVentas, updateVenta } from "../services/ventasService";

const itemsPerPage = 8;

export function useVentas() {
  const [ventas, setVentas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterMetodo, setFilterMetodo] = useState("todos");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [metodosPago, setMetodosPago] = useState([]);
  const [updatingSaleId, setUpdatingSaleId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activationStatus, setActivationStatus] = useState("pendiente");
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadVentas = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [records, methods] = await Promise.all([getVentas(), getMetodosPago()]);
      setVentas(records);
      setMetodosPago(methods);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVentas();
  }, [loadVentas]);

  const filtered = ventas.filter((v) => {
    const matchSearch =
      String(v.id_venta).includes(searchTerm) ||
      String(v.id_cliente).includes(searchTerm) ||
      String(v.nombre_usuario || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filterEstado === "anulados"
      ? v.estado === "cancelada"
      : filterEstado === "todos"
        ? v.estado !== "cancelada"
        : v.estado === filterEstado;
    const matchMetodo = filterMetodo === "todos" || v.id_metodo_pago === Number(filterMetodo);
    return matchSearch && matchEstado && matchMetodo;
  });

  const totalPages = Math.max(Math.ceil(filtered.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVentas = filtered.slice(startIndex, endIndex);

  const totalIngresado = ventas.filter((v) => v.estado === "pagada").reduce((a, v) => a + Number(v.total || 0), 0);
  const stats = {
    total: ventas.length,
    pagadas: ventas.filter((v) => v.estado === "pagada").length,
    pendientes: ventas.filter((v) => v.estado === "pendiente" || v.estado === "credito").length,
    ingresos: totalIngresado,
  };

  const handleNuevo = () => {
    const now = new Date();
    const fechaActual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    setError("");
    setFormData({ ...emptyForm, fecha_venta: fechaActual });
    setShowModal(true);
  };

  const handleGuardarNuevo = async () => {
    if (!formData.id_cliente || !formData.id_metodo_pago || !formData.fecha_venta || !formData.items?.length) {
      setError("Completa el cliente, la fecha, el método de pago y agrega al menos un concepto.");
      return;
    }
    let idCita = formData.id_cita || "";
    if (formData.tieneCita === false && formData.cita_id_vehiculo && formData.cita_fecha && formData.cita_hora) {
      const servicios = (formData.items || [])
        .filter((item) => item.id_servicio)
        .map((item) => ({ id: item.id_servicio, nombre: item.nombre }));
      if (servicios.length === 0) {
        setError("Agrega al menos un servicio para crear una cita.");
        return;
      }
      try {
        const cita = await createCita({
          id_vehiculo: Number(formData.cita_id_vehiculo),
          id_cliente: Number(formData.id_cliente),
          fecha_cita: formData.cita_fecha,
          hora_cita: formData.cita_hora,
          estado: "programada",
          observaciones: formData.cita_observaciones || "",
        }, servicios);
        idCita = cita.id;
      } catch (requestError) {
        setError(requestError.message);
        return;
      }
    }

    setError("");
    try {
      const venta = await createVenta({ ...formData, id_cita: idCita });
      setVentas((current) => [venta, ...current]);
      setShowModal(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleVerDetalles = (venta) => { setSelected(venta); setShowDetailModal(true); };
  const handleEditar = (venta) => {
    setSelected(venta);
    setFormData({ ...emptyForm, ...venta, tieneCita: Boolean(venta.id_cita) });
    setError("");
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleGuardarEdicion = async () => {
    if (!selected) return;
    if (!formData.id_cliente || !formData.id_metodo_pago || !formData.fecha_venta) {
      setError("Completa el cliente, la fecha y el método de pago.");
      return;
    }
    setError("");
    try {
      const venta = await updateVenta(selected.id_venta, formData);
      setVentas((current) => current.map((item) => item.id_venta === venta.id_venta ? venta : item));
      setShowEditModal(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleAnular = (venta) => { setSelected(venta); setShowCancelModal(true); };
  const handleConfirmarAnular = async () => {
    if (!selected) return;
    setError("");
    try {
      const venta = await updateVenta(selected.id_venta, { ...selected, estado: "cancelada" });
      setVentas((current) => current.map((item) => item.id_venta === venta.id_venta ? venta : item));
      setShowCancelModal(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleCambiarEstado = async (venta, estado) => {
    if (venta.estado === estado || updatingSaleId !== null) return;
    if (venta.estado === "cancelada") {
      setSelected(venta);
      setActivationStatus(estado);
      setShowActivateModal(true);
      return;
    }
    setUpdatingSaleId(venta.id_venta);
    setError("");
    try {
      const updatedSale = await updateVenta(venta.id_venta, { ...venta, estado });
      setVentas((current) => current.map((item) => item.id_venta === updatedSale.id_venta ? updatedSale : item));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingSaleId(null);
    }
  };

  const handleConfirmarActivacion = async () => {
    if (!selected) return;
    setUpdatingSaleId(selected.id_venta);
    setError("");
    try {
      const updatedSale = await updateVenta(selected.id_venta, { ...selected, estado: activationStatus });
      setVentas((current) => current.map((item) => item.id_venta === updatedSale.id_venta ? updatedSale : item));
      setShowActivateModal(false);
      if (filterEstado === "anulados") {
        setFilterEstado("todos");
        setCurrentPage(1);
      }
      setSelected(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingSaleId(null);
    }
  };

  const closeAll = () => {
    setShowModal(false);
    setShowDetailModal(false);
    setShowEditModal(false);
    setShowCancelModal(false);
    setShowActivateModal(false);
    setSelected(null);
    setError("");
  };
  const clearFilters = () => {
    setFilterEstado("todos");
    setFilterMetodo("todos");
    setSearchTerm("");
    setCurrentPage(1);
  };
  const handleSearchChange = (value) => { setSearchTerm(value); setCurrentPage(1); };
  const handleFilterEstadoChange = (value) => { setFilterEstado(value); setCurrentPage(1); };
  const handleFilterMetodoChange = (value) => { setFilterMetodo(value); setCurrentPage(1); };

  return {
    ventas, searchTerm, setSearchTerm, filterEstado, setFilterEstado, error, loading, loadVentas, metodosPago, updatingSaleId,
    filterMetodo, setFilterMetodo, showFilters, setShowFilters,
    showModal, showDetailModal, showEditModal, showCancelModal, showActivateModal, activationStatus, selected, formData, setFormData,
    filtered, stats, currentPage, setCurrentPage, totalPages, startIndex, endIndex, paginatedVentas,
    handleNuevo, handleGuardarNuevo, handleVerDetalles, handleEditar,
    handleGuardarEdicion, handleAnular, handleConfirmarAnular, handleCambiarEstado, handleConfirmarActivacion, closeAll, clearFilters,
    handleSearchChange, handleFilterEstadoChange, handleFilterMetodoChange,
  };
}
