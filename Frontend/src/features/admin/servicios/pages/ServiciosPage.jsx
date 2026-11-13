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
    servicios, searchTerm, filterEstado, setFilterEstado, loading, saving, error, loadServicios,
    showFilter, setShowFilter, viewMode, setViewMode, modal, selected, form, setForm, deleteId, setDeleteId,
    filteredServicios, stats, currentPage, setCurrentPage, totalPages, startIndex, endIndex, paginatedServicios,
    openCrear, openCrearSubservicio, openEditar, openVer, backToPreviousDetail, backFromForm, detailHistory, closeModal, handleToggleEstado, handleGuardar, handleEliminar, clearFilters,
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

      <details className="rounded-lg border border-border bg-card px-4 py-3">
        <summary className="cursor-pointer font-medium">
          Ejemplo visual de códigos jerárquicos
          <span className="ml-2 text-xs font-normal text-muted-foreground">Solo vista previa; no se guarda en la base de datos</span>
        </summary>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-lg bg-accent/40 p-3">
            <p className="font-semibold"><span className="mr-2 text-primary">5</span>Cambio de aceite</p>
            <p className="mt-2 pl-4 text-muted-foreground"><span className="mr-2 text-primary">5.1</span>Cambio de aceite de motor</p>
            <p className="mt-1 pl-8 text-muted-foreground"><span className="mr-2 text-primary">5.1.1</span>Aceite sintético</p>
            <p className="mt-1 pl-8 text-muted-foreground"><span className="mr-2 text-primary">5.1.2</span>Aceite semisintético</p>
            <p className="mt-1 pl-8 text-muted-foreground"><span className="mr-2 text-primary">5.1.3</span>Aceite mineral</p>
            <p className="mt-2 pl-4 text-muted-foreground"><span className="mr-2 text-primary">5.2</span>Cambio de aceite de transmisión</p>
            <p className="mt-1 pl-4 text-muted-foreground"><span className="mr-2 text-primary">5.3</span>Cambio de filtro de aceite</p>
          </div>
          <div className="rounded-lg bg-accent/40 p-3">
            <p className="font-semibold"><span className="mr-2 text-primary">6</span>Suspensión</p>
            <p className="mt-2 pl-4 text-muted-foreground"><span className="mr-2 text-primary">6.1</span>Suspensión delantera</p>
            <p className="mt-1 pl-8 text-muted-foreground"><span className="mr-2 text-primary">6.1.1</span>Cambio de amortiguadores</p>
            <p className="mt-1 pl-8 text-muted-foreground"><span className="mr-2 text-primary">6.1.2</span>Cambio de espirales</p>
            <p className="mt-1 pl-8 text-muted-foreground"><span className="mr-2 text-primary">6.1.3</span>Cambio de soportes</p>
            <p className="mt-2 pl-4 text-muted-foreground"><span className="mr-2 text-primary">6.2</span>Suspensión trasera</p>
            <p className="mt-1 pl-4 text-muted-foreground"><span className="mr-2 text-primary">6.3</span>Diagnóstico de suspensión</p>
          </div>
        </div>
      </details>

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

      <ServicioDetailModal
        open={modal === "ver"}
        servicio={selected}
        servicios={servicios}
        onClose={closeModal}
        onVer={openVer}
        onBack={backToPreviousDetail}
        canGoBack={detailHistory.length > 0 || servicios.some(
          (item) => Number(item.id) === Number(selected?.id_servicio_padre),
        )}
        onEditar={openEditar}
        onAgregarSubservicio={openCrearSubservicio}
      />

      <ServicioFormModal modal={modal} form={form} setForm={setForm} onClose={closeModal} onBack={backFromForm} onGuardar={handleGuardar} saving={saving} error={error} />

      <DeleteConfirmModal deleteId={deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleEliminar} />
    </div>
  );
}
