import { Plus, Ban } from "lucide-react";
import { useProveedores } from "../hooks/useProveedores";
import { StatsRow } from "../components/StatsRow";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { FilterPanel } from "../components/FilterPanel";
import { ProveedoresTable } from "../components/ProveedoresTable";
import { ModalWrapper } from "../components/ModalWrapper";
import { ModalFooter } from "../components/ModalFooter";
import { FormProveedor } from "../components/FormProveedor";
import { DetailField } from "../components/DetailField";
import { PaginationBar } from "../../components/PaginationBar";
import { estadoConfig } from "../services/proveedoresData";

export default function ProveedoresPage() {
  const {
    proveedores, searchTerm, filterEstado, setFilterEstado,
    showFilters, setShowFilters,
    showModal, showDetailModal, showEditModal, showAnularModal, selected, formData, setFormData,
    filtered, stats, currentPage, setCurrentPage, totalPages, startIndex, endIndex, paginatedProveedores,
    handleNuevo, handleGuardarNuevo, handleVerDetalles, handleEditar,
    handleGuardarEdicion, handleAnular, handleConfirmarAnular, handleToggleEstado, closeAll, clearFilters,
    handleSearchChange, handleFilterEstadoChange,
  } = useProveedores();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Gestión de Proveedores</h1>
          <p className="text-muted-foreground mt-1">Administra los proveedores del taller</p>
        </div>
        <button onClick={handleNuevo} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors">
          <Plus className="w-5 h-5" /> Nuevo Proveedor
        </button>
      </div>

      <StatsRow stats={stats} />

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          showFilters={showFilters}
          onToggleFilters={setShowFilters}
          filterContent={
            <FilterPanel
            filterEstado={filterEstado}
            onFilterEstadoChange={handleFilterEstadoChange}
            onSelect={() => setShowFilters(false)}
            onClear={clearFilters}
            />
          }
        />

        <ProveedoresTable proveedores={paginatedProveedores} onToggleEstado={handleToggleEstado} onVerDetalles={handleVerDetalles} onEditar={handleEditar} onAnular={handleAnular} />

        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          total={filtered.length}
          onPageChange={setCurrentPage}
          itemName="proveedores"
        />
      </div>

      {showModal && (
        <ModalWrapper title="Nuevo Proveedor" onClose={closeAll}>
          <FormProveedor formData={formData} setFormData={setFormData} />
          <ModalFooter onCancel={closeAll} onSave={handleGuardarNuevo} saveLabel="Guardar Proveedor" />
        </ModalWrapper>
      )}

      {showDetailModal && selected && (
        <ModalWrapper title="Detalles del Proveedor" onClose={closeAll}>
          <div className="grid grid-cols-2 gap-4">
            <DetailField label="Nombre de la Empresa" value={selected.nombre_empresa} />
            <DetailField label="Nombre del Cliente" value={selected.nombre_cliente} />
            <DetailField label="NIT" value={selected.nit} />
            <DetailField label="Email" value={selected.email} />
            <DetailField label="Teléfono" value={selected.telefono} />
            <DetailField label="Dirección" value={selected.direccion} />
            <DetailField label="Estado" value={estadoConfig[selected.estado].label} />
          </div>
          {selected.notas && <div className="mt-4"><DetailField label="Notas" value={selected.notas} /></div>}
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <button onClick={closeAll} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Cerrar</button>
            <button onClick={() => handleEditar(selected)} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors">Editar Proveedor</button>
          </div>
        </ModalWrapper>
      )}

      {showEditModal && selected && (
        <ModalWrapper title="Editar Proveedor" onClose={closeAll}>
          <FormProveedor formData={formData} setFormData={setFormData} />
          <ModalFooter onCancel={closeAll} onSave={handleGuardarEdicion} saveLabel="Guardar Cambios" />
        </ModalWrapper>
      )}

      {showAnularModal && selected && (
        <ModalWrapper title="Anular Proveedor" onClose={closeAll}>
          <div className="flex items-center gap-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <Ban className="w-8 h-8 text-destructive shrink-0" />
            <div>
              <p className="font-medium">¿Estás seguro de anular este proveedor?</p>
              <p className="text-sm text-muted-foreground mt-1"><strong>{selected.nombre_empresa}</strong> se conservará con estado anulado.</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <button onClick={closeAll} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Cancelar</button>
            <button onClick={handleConfirmarAnular} className="px-6 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition-opacity">Sí, Anular</button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}
