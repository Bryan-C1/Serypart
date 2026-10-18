import { Plus } from "lucide-react";
import { useServicios } from "../hooks/useServicios";
import { StatsRow } from "../components/StatsRow";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { ServicioCardGrid } from "../components/ServicioCardGrid";
import { ServiciosTable } from "../components/ServiciosTable";
import { ServicioDetailModal } from "../components/ServicioDetailModal";
import { ServicioFormModal } from "../components/ServicioFormModal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { PaginationBar } from "../../components/PaginationBar";

export default function ServiciosPage() {
  const {
    searchTerm, filterEstado, setFilterEstado, loading, saving, error, loadServicios,
    showFilter, setShowFilter, viewMode, setViewMode, modal, selected, form, setForm, deleteId, setDeleteId,
    filteredServicios, stats, currentPage, setCurrentPage, totalPages, startIndex, endIndex, paginatedServicios,
    openCrear, openEditar, openVer, closeModal, handleToggleEstado, handleGuardar, handleEliminar, clearFilters,
    handleSearchChange, handleFilterEstadoChange, handleViewModeChange,
  } = useServicios();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Gestión de Servicios</h1>
          <p className="text-muted-foreground mt-1">Administra los servicios del taller</p>
        </div>
        <button
          onClick={openCrear}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Servicio
        </button>
      </div>

      <StatsRow stats={stats} />

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filterEstado={filterEstado}
          onFilterEstadoChange={handleFilterEstadoChange}
          showFilter={showFilter}
          onToggleFilter={setShowFilter}
          onClearFilters={clearFilters}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />

        {error && (
          <div role="alert" className="my-4 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">
            <span>{error}</span>
            <button onClick={loadServicios} className="font-medium text-primary hover:underline">Reintentar</button>
          </div>
        )}

        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Cargando servicios...</p>
        ) : viewMode === "cards" ? (
          <ServicioCardGrid
            servicios={paginatedServicios}
            onToggleEstado={handleToggleEstado}
            onVer={openVer}
            onEditar={openEditar}
            onEliminar={setDeleteId}
          />
        ) : (
          <ServiciosTable
            servicios={paginatedServicios}
            onToggleEstado={handleToggleEstado}
            onVer={openVer}
            onEditar={openEditar}
            onEliminar={setDeleteId}
          />
        )}

        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          total={filteredServicios.length}
          onPageChange={setCurrentPage}
          itemName="servicios"
        />
      </div>

      <ServicioDetailModal open={modal === "ver"} servicio={selected} onClose={closeModal} onEditar={openEditar} />

      <ServicioFormModal modal={modal} form={form} setForm={setForm} onClose={closeModal} onGuardar={handleGuardar} saving={saving} error={error} />

      <DeleteConfirmModal deleteId={deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleEliminar} />
    </div>
  );
}
