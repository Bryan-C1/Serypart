import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { StatusConfirmModal } from "../../components/StatusConfirmModal";
import { useAgendamiento } from "../hooks/useAgendamiento";
import { getFechaLocalActual } from "../services/agendamientoData";
import { MonthCalendarCard } from "../components/MonthCalendarCard";
import { CitaDetailModal } from "../components/CitaDetailModal";
import { TodayAppointmentsList } from "../components/TodayAppointmentsList";
import { UpcomingAppointmentsTable } from "../components/UpcomingAppointmentsTable";
import { NewCitaModal } from "../components/NewCitaModal";

export default function AgendamientoPage() {
  const [citaDetalle, setCitaDetalle] = useState(null);
  const [citaPendienteEdicion, setCitaPendienteEdicion] = useState(null);
  const [fechaCitasVisible, setFechaCitasVisible] = useState(getFechaLocalActual);
  const {
    showModal, selectedCita, selectedDate, days, blanks, citas, monthLabel, currentDate,
    catalogs, catalogsLoading, catalogsError, loading, error, saving, loadCitas, loadCatalogs,
    cambiarMes, volverAlDiaActual, navegarAFecha, abrirNuevaCita, abrirEdicion, cerrarModal, anularCita, cambiarEstadoCita, handleGuardarCita,
  } = useAgendamiento();
  const [searchParams] = useSearchParams();
  const [filterEstado, setFilterEstado] = useState("todos");
  const citaId = searchParams.get("cita");
  const vehiculoId = searchParams.get("vehiculo");
  const clienteId = searchParams.get("cliente");
  const filtrarCitas = (lista) => lista.filter((cita) => (
    (!vehiculoId || String(cita.id_vehiculo) === vehiculoId) &&
    (!clienteId || String(cita.id_cliente) === clienteId)
  ));
  const citasFiltradas = (vehiculoId || clienteId ? filtrarCitas(citas) : citas)
    .filter((cita) => filterEstado === "todos"
      ? cita.estado !== "cancelada"
      : filterEstado === "anulados"
        ? cita.estado === "cancelada"
        : cita.estado === filterEstado);
  const vistaFiltrada = vehiculoId || clienteId;
  const citasFiltradasKey = citasFiltradas.map((cita) => `${cita.id}:${cita.fecha_cita}`).join("|");
  const irAlDiaActual = () => {
    volverAlDiaActual();
    setFechaCitasVisible(getFechaLocalActual());
  };
  const handleCambiarEstadoCita = async (cita, estado) => {
    const updated = await cambiarEstadoCita(cita, estado);
    if (updated && cita.estado === "cancelada" && filterEstado === "anulados") setFilterEstado("todos");
  };

  useEffect(() => {
    if (!citaId) return;
    const cita = citas.find((item) => String(item.id) === citaId);
    if (!cita) return;

    setFechaCitasVisible(cita.fecha_cita);
    navegarAFecha(cita.fecha_cita);
    setCitaDetalle(cita);
  }, [citaId, citas, navegarAFecha]);

  useEffect(() => {
    if (!vistaFiltrada || citasFiltradas.length === 0) return;

    const citasOrdenadas = [...citasFiltradas]
      .filter((cita) => /^\d{4}-\d{2}-\d{2}$/.test(cita.fecha_cita || ""))
      .sort((a, b) => a.fecha_cita.localeCompare(b.fecha_cita));
    if (citasOrdenadas.length === 0) return;

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const siguienteCita = citasOrdenadas.find((cita) => cita.fecha_cita >= today);
    const citaVisible = siguienteCita || citasOrdenadas[citasOrdenadas.length - 1];
    setFechaCitasVisible(citaVisible.fecha_cita);
    navegarAFecha(citaVisible.fecha_cita);
  }, [vistaFiltrada, clienteId, vehiculoId, citasFiltradasKey]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{vistaFiltrada ? "Servicios solicitados" : "Agendamiento"}</h1>
          <p className="text-muted-foreground mt-1">{vistaFiltrada ? `Citas y servicios solicitados por ${vehiculoId ? "este vehículo" : "este cliente"}` : "Gestiona las citas y agenda del taller"}</p>
        </div>
        <button
          onClick={() => abrirNuevaCita()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Cita
        </button>
      </div>

      {(error || catalogsError) && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <span>{[error, catalogsError].filter(Boolean).join(" ")}</span>
          <div className="flex gap-2">
            {error && <button type="button" onClick={loadCitas} className="font-medium underline">Reintentar citas</button>}
            {catalogsError && <button type="button" onClick={loadCatalogs} className="font-medium underline">Reintentar catálogos</button>}
          </div>
        </div>
      )}

      {citaId && !loading && !error && !citas.some((cita) => String(cita.id) === citaId) && (
        <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          No se encontró la cita solicitada (ID {citaId}).
        </div>
      )}

      <div className="flex flex-wrap gap-2" aria-label="Filtrar citas por estado">
        {[
          ["todos", "Todas"],
          ["programada", "Programadas"],
          ["en_proceso", "En proceso"],
          ["completada", "Completadas"],
          ["anulados", "Anulados"],
        ].map(([estado, label]) => (
          <button
            key={estado}
            type="button"
            onClick={() => setFilterEstado(estado)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${filterEstado === estado ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MonthCalendarCard
          days={days}
          blanks={blanks}
          currentDate={currentDate}
          monthLabel={monthLabel}
          citas={citasFiltradas}
          onPreviousMonth={() => cambiarMes(-1)}
          onNextMonth={() => cambiarMes(1)}
          onTodayClick={irAlDiaActual}
          onDayClick={abrirNuevaCita}
          onDayWithCitas={setFechaCitasVisible}
          onCitaClick={setCitaDetalle}
        />
        {loading
          ? <div role="status" className="bg-card border border-border rounded-lg p-6 text-muted-foreground">Cargando citas...</div>
          : <TodayAppointmentsList citas={citasFiltradas} fecha={fechaCitasVisible} onCitaClick={setCitaDetalle} />}
      </div>

      {!loading && <UpcomingAppointmentsTable citas={citasFiltradas} onCitaClick={setCitaDetalle} onChangeStatus={handleCambiarEstadoCita} />}

      <NewCitaModal
        open={showModal}
        onClose={cerrarModal}
        onSave={handleGuardarCita}
        initialData={selectedCita}
        initialDate={selectedDate}
        citas={citas}
        catalogs={catalogs}
        catalogsLoading={catalogsLoading}
        catalogsError={catalogsError}
        onRefreshCatalogs={loadCatalogs}
        saving={saving}
      />

      <CitaDetailModal
        cita={citaDetalle}
        onClose={() => setCitaDetalle(null)}
        onEditar={() => {
          setCitaPendienteEdicion(citaDetalle);
          setCitaDetalle(null);
        }}
        onAnular={() => {
          setCitaPendienteEdicion({ ...citaDetalle, accion: "anular" });
          setCitaDetalle(null);
        }}
      />

      <StatusConfirmModal
        item={citaPendienteEdicion}
        entityName={citaPendienteEdicion ? `la cita del ${citaPendienteEdicion.fecha_cita} a las ${citaPendienteEdicion.hora_cita}` : ""}
        isActive={citaPendienteEdicion?.accion === "anular"}
        title={citaPendienteEdicion?.accion === "anular" ? "Anular cita" : "Editar cita"}
        actionText={citaPendienteEdicion?.accion === "anular" ? "anular" : "editar"}
        actionLabel={citaPendienteEdicion?.accion === "anular" ? "Anular cita" : "Editar cita"}
        onCancel={() => setCitaPendienteEdicion(null)}
        onConfirm={() => {
          if (citaPendienteEdicion.accion === "anular") anularCita(citaPendienteEdicion);
          else abrirEdicion(citaPendienteEdicion);
          setCitaPendienteEdicion(null);
        }}
      />
    </div>
  );
}
