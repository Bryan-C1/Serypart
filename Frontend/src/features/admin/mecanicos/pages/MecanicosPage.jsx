import { Plus, Ban } from "lucide-react";
import { useMecanicos } from "../hooks/useMecanicos";
import { StatsRow } from "../components/StatsRow";
import { SearchSortFilterBar } from "../components/SearchSortFilterBar";
import { MecanicosTable } from "../components/MecanicosTable";
import { PaginationBar } from "../components/PaginationBar";
import { ModalWrapper } from "../components/ModalWrapper";
import { ModalFooter } from "../components/ModalFooter";
import { FormMecanico } from "../components/FormMecanico";
import { DetailField } from "../components/DetailField";
import { estadoConfig, formatHorariosPorDia, normalizeHorariosPorDia } from "../services/mecanicosData";

export default function MecanicosPage() {
  const {
    searchTerm, filterEstado, filterEspecialidad, showFilters, setShowFilters, sortBy,
    loading, saving, error, formError, loadMecanicos,
    currentPage, setCurrentPage, totalPages, startIndex, endIndex,
    sortedMecanicos, paginatedMecanicos, stats,
    showModal, showDetailModal, showEditModal, showAnularModal,
    selectedMecanico, formData, setFormData,
    handleSearchChange, handleFilterEstadoChange, handleFilterEspecialidadChange, handleSortChange, clearFilters,
    handleNuevo, handleGuardarNuevo, handleVerDetalles, handleEditar,
    handleGuardarEdicion, handleAnular, handleConfirmarAnular,
    handleToggleEstado, closeAll,
  } = useMecanicos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Gestión de Mecánicos</h1>
          <p className="text-muted-foreground mt-1">Administra el equipo de trabajo del taller</p>
        </div>
        <button onClick={handleNuevo} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors">
          <Plus className="w-5 h-5" />
          Nuevo Mecánico
        </button>
      </div>

      {error && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <span>{error}</span>
          <button type="button" onClick={loadMecanicos} className="font-medium underline">Reintentar</button>
        </div>
      )}

      <StatsRow stats={stats} />

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <SearchSortFilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          showFilters={showFilters}
          onToggleFilters={setShowFilters}
          filterEstado={filterEstado}
          onFilterEstadoChange={handleFilterEstadoChange}
          filterEspecialidad={filterEspecialidad}
          onFilterEspecialidadChange={handleFilterEspecialidadChange}
          onClearFilters={clearFilters}
        />

        {loading
          ? <div role="status" className="py-10 text-center text-muted-foreground">Cargando mecánicos...</div>
          : <MecanicosTable
              mecanicos={paginatedMecanicos}
              onToggleEstado={handleToggleEstado}
              onVerDetalles={handleVerDetalles}
              onEditar={handleEditar}
              onAnular={handleAnular}
            />}

        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          total={sortedMecanicos.length}
          onPageChange={setCurrentPage}
        />
      </div>

      {showModal && (
        <ModalWrapper title="Nuevo Mecánico" onClose={closeAll}>
          <FormMecanico formData={formData} setFormData={setFormData} />
          {formError && <div role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{formError}</div>}
          <ModalFooter onCancel={closeAll} onSave={handleGuardarNuevo} saveLabel="Guardar Mecánico" disabled={saving} />
        </ModalWrapper>
      )}

      {showDetailModal && selectedMecanico && (
        <ModalWrapper title="Detalles del Mecánico" onClose={closeAll}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DetailField label="Nombre" value={selectedMecanico.nombre} />
              <DetailField label="Tipo de documento" value={selectedMecanico.tipoDocumento} />
              <DetailField label="Número de documento" value={selectedMecanico.numeroDocumento} />
              <DetailField label="Apellido" value={selectedMecanico.apellido} />
              <DetailField label="Dirección" value={selectedMecanico.direccion || "—"} />
              <DetailField label="Email" value={selectedMecanico.email} />
              <DetailField label="Teléfono" value={selectedMecanico.telefono} />
              <DetailField label="Especialidad" value={selectedMecanico.especialidad} />
              <DetailField label="Turno" value={selectedMecanico.turno || "—"} />
              <DetailField label="Horario de disponibilidad" value={selectedMecanico.horarioDisponibilidad || formatHorariosPorDia(normalizeHorariosPorDia(selectedMecanico.horariosPorDia)) || "—"} />
              <DetailField label="Estado" value={estadoConfig[selectedMecanico.estado].label} />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <button onClick={closeAll} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Cerrar</button>
            <button onClick={() => handleEditar(selectedMecanico)} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors">
              Editar Mecánico
            </button>
          </div>
        </ModalWrapper>
      )}

      {showEditModal && selectedMecanico && (
        <ModalWrapper title="Editar Mecánico" onClose={closeAll}>
          <FormMecanico formData={formData} setFormData={setFormData} />
          {formError && <div role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{formError}</div>}
          <ModalFooter onCancel={closeAll} onSave={handleGuardarEdicion} saveLabel="Guardar Cambios" disabled={saving} />
        </ModalWrapper>
      )}

      {showAnularModal && selectedMecanico && (
        <ModalWrapper title="Anular Mecánico" onClose={closeAll}>
          <div className="flex items-center gap-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <Ban className="w-8 h-8 text-destructive shrink-0" />
            <div>
              <p className="font-medium">¿Estás seguro de anular este mecánico?</p>
              <p className="text-sm text-muted-foreground mt-1"><strong>{selectedMecanico.nombre}</strong> se conservará con estado anulado.</p>
            </div>
          </div>
          {formError && <div role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{formError}</div>}
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <button onClick={closeAll} disabled={saving} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50">Cancelar</button>
            <button onClick={handleConfirmarAnular} disabled={saving} className="px-6 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">{saving ? "Guardando..." : "Sí, Anular"}</button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}
