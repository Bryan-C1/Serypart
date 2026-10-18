import { useCallback, useEffect, useRef, useState } from "react";
import { CITAS_UPDATED_EVENT, getCitasGuardadas } from "../services/agendamientoData";
import { createCita, getAgendamientoCatalogs, getCitas, updateCita } from "../services/agendamientoService";

export function useAgendamiento() {
  const [citas, setCitas] = useState(getCitasGuardadas);
  const [catalogs, setCatalogs] = useState({ clientes: [], vehiculos: [], servicios: [] });
  const [loading, setLoading] = useState(true);
  const [catalogsLoading, setCatalogsLoading] = useState(true);
  const [error, setError] = useState("");
  const [catalogsError, setCatalogsError] = useState("");
  const [saving, setSaving] = useState(false);
  const savingCitaRef = useRef(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const loadCitas = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setCitas(await getCitas());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCatalogs = useCallback(async () => {
    setCatalogsLoading(true);
    setCatalogsError("");
    try {
      setCatalogs(await getAgendamientoCatalogs());
    } catch (requestError) {
      setCatalogsError(requestError.message);
    } finally {
      setCatalogsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCitas();
    loadCatalogs();
  }, [loadCitas, loadCatalogs]);

  useEffect(() => {
    const updateCache = () => setCitas(getCitasGuardadas());
    window.addEventListener(CITAS_UPDATED_EVENT, updateCache);
    return () => window.removeEventListener(CITAS_UPDATED_EVENT, updateCache);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const monthLabel = currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  const formatDate = (year, month, day) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const cambiarMes = (incremento) => {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + incremento, 1));
  };

  const volverAlDiaActual = () => {
    setCurrentDate(new Date());
  };

  const navegarAFecha = (fecha) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha || "");
    if (!match) return;
    const [, year, month, day] = match.map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return;
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const abrirNuevaCita = (day) => {
    setSelectedCita(null);
    setSelectedDate(day ? formatDate(currentDate.getFullYear(), currentDate.getMonth(), day) : "");
    setShowModal(true);
  };

  const abrirEdicion = (cita) => {
    setSelectedCita(cita);
    setSelectedDate("");
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setSelectedCita(null);
    setSelectedDate("");
  };

  const anularCita = async (cita) => {
    setError("");
    try {
      const updated = await updateCita(cita.id, { ...cita, estado: "cancelada" }, cita.servicios || []);
      setCitas((current) => current.map((item) => item.id === updated.id ? updated : item));
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    }
  };

  const cambiarEstadoCita = async (cita, estado) => {
    setError("");
    try {
      const updated = await updateCita(cita.id, { ...cita, estado }, cita.servicios || []);
      setCitas((current) => current.map((item) => item.id === updated.id ? updated : item));
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    }
  };

  const handleGuardarCita = async (form, serviciosSeleccionados) => {
    if (savingCitaRef.current) return false;
    savingCitaRef.current = true;
    setError("");
    setSaving(true);
    try {
      const cita = selectedCita
        ? await updateCita(selectedCita.id, { ...form, estado: selectedCita.estado === "cancelada" ? "cancelada" : form.estado }, serviciosSeleccionados)
        : await createCita(form, serviciosSeleccionados);
      setCitas((current) => selectedCita
        ? current.map((item) => item.id === cita.id ? cita : item)
        : current.some((item) => item.id === cita.id) ? current : [...current, cita]);
      cerrarModal();
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      savingCitaRef.current = false;
      setSaving(false);
    }
  };

  return {
    showModal,
    selectedCita,
    selectedDate,
    catalogs, catalogsLoading, catalogsError, loading, error, saving, loadCitas, loadCatalogs,
    days,
    blanks,
    citas,
    monthLabel,
    currentDate,
    navegarAFecha,
    cambiarMes,
    volverAlDiaActual,
    abrirNuevaCita,
    abrirEdicion,
    cerrarModal,
    anularCita,
    cambiarEstadoCita,
    handleGuardarCita,
  };
}
