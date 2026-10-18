import { Plus } from "lucide-react";
import { useVehiculos } from "../hooks/useVehiculos";
import { StatsRow } from "../components/StatsRow";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { VehiculoCardGrid } from "../components/VehiculoCardGrid";
import { VehiculosTable } from "../components/VehiculosTable";
import { VehiculoFormModal } from "../components/VehiculoFormModal";
import { VehiculoDetailModal } from "../components/VehiculoDetailModal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { PaginationBar } from "../../components/PaginationBar";

export default function VehiculosPage() {
  const {
    searchTerm, filterEstado, setFilterEstado, showFilter, setShowFilter, viewMode, setViewMode,
    clienteId, usuarios, usuariosLoading, usuariosError, loadUsuarios,
    loading, error, loadVehiculos, loadTiposVehiculo, tiposVehiculo, tiposVehiculoLoading, tiposError, actionError,
    modal, selected, form, setForm, deleteId, setDeleteId,
    filteredVehiculos, stats, currentPage, setCurrentPage, totalPages, startIndex, endIndex, paginatedVehiculos,
    openCrear, openEditar, openVer, closeModal, handleGuardar, handleEliminar, handleToggleEstado,
    handleSearchChange, handleFilterChange, handleViewModeChange,
  } = useVehiculos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{clienteId ? "Vehículos del Cliente" : "Gestión de Vehículos"}</h1>
          <p className="text-muted-foreground mt-1">{clienteId ? "Vehículos registrados para este cliente" : "Administra los vehículos registrados"}</p>
        </div>
        <button
          onClick={openCrear}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Vehículo
        </button>
      </div>

      <StatsRow stats={stats} />

      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => {
              loadVehiculos();
              loadUsuarios();
              loadTiposVehiculo();
            }}
            className="font-medium underline"
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filterEstado={filterEstado}
          onFilterChange={handleFilterChange}
          showFilter={showFilter}
          onToggleFilter={setShowFilter}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />

        {loading ? (
          <p role="status" className="py-10 text-center text-muted-foreground">Cargando vehículos...</p>
        ) : viewMode === "cards" ? (
          <VehiculoCardGrid
            vehiculos={paginatedVehiculos}
            usuarios={usuarios}
            onToggleEstado={handleToggleEstado}
            onVer={openVer}
            onEditar={openEditar}
            onEliminar={setDeleteId}
          />
        ) : (
          <VehiculosTable
            vehiculos={paginatedVehiculos}
            usuarios={usuarios}
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
          total={filteredVehiculos.length}
          onPageChange={setCurrentPage}
          itemName="vehículos"
        />
      </div>

      <VehiculoFormModal
        modal={modal}
        form={form}
        setForm={setForm}
        onClose={closeModal}
        onGuardar={handleGuardar}
        usuarios={usuarios.filter((usuario) => String(usuario.estado || "").toLowerCase() !== "anulado")}
        usuariosLoading={usuariosLoading}
        usuariosError={usuariosError}
        onRetryUsuarios={loadUsuarios}
        tiposVehiculo={tiposVehiculo}
        tiposVehiculoLoading={tiposVehiculoLoading}
        tiposVehiculoError={tiposError}
        onRetryTipos={loadTiposVehiculo}
        saveError={actionError}
      />

      <VehiculoDetailModal
        open={modal === "ver"}
        vehiculo={selected}
        usuarios={usuarios}
        onClose={closeModal}
        onEditar={openEditar}
      />

      <DeleteConfirmModal deleteId={deleteId} onCancel={() => setDeleteId(null)} onConfirm={handleEliminar} />
    </div>
  );
}
