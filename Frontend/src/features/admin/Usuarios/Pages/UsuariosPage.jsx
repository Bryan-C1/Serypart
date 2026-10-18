import { Plus, Ban } from "lucide-react";
import { useUsuarios } from "../Hooks/useUsuarios";
import { StatsRow } from "../Components/StatsRow";
import { SearchFilterBar } from "../Components/SearchFilterBar";
import { FilterPanel } from "../Components/FilterPanel";
import { UsuariosTable } from "../Components/UsuariosTable";
import { PaginationBar } from "../Components/PaginationBar";
import { ModalWrapper } from "../Components/ModalWrapper";
import { ModalFooter } from "../Components/ModalFooter";
import { FormUsuario } from "../Components/FormUsuario";
import { DetailField } from "../Components/DetailField";
import { getRolNombre } from "../../Roles/Services/rolesData";

export default function UsuariosPage() {
  const {
    loading, error, searchTerm, filterEstado, showFilters, setShowFilters, sortBy,
    currentPage, setCurrentPage, totalPages, startIndex, endIndex,
    sortedUsuarios, paginatedUsuarios, stats,
    showModal, showDetailModal, showEditModal, showDeleteModal,
    selectedUsuario, formData, setFormData,
    handleSearchChange, handleFilterChange, handleSortChange, clearFilters,
    openCreate, openEdit, openVerDetalles, openEliminar,
    handleGuardarNuevo, handleGuardarEdicion, handleConfirmarEliminar,
    handleToggleEstado, loadUsuarios, closeAll,
  } = useUsuarios();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Usuarios</h1>
          <p className="text-muted-foreground">Administra los usuarios con acceso al sistema</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </button>
      </div>

      <StatsRow stats={stats} />

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          showFilters={showFilters}
          onToggleFilters={setShowFilters}
          filterContent={<FilterPanel filterEstado={filterEstado} onFilterChange={handleFilterChange} onSelect={() => setShowFilters(false)} onClear={clearFilters} />}
        />

        {loading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Cargando usuarios...</p>
        ) : error ? (
          <div role="alert" className="py-8 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <button onClick={loadUsuarios} className="mt-2 text-sm font-medium text-primary hover:underline">
              Reintentar
            </button>
          </div>
        ) : (
          <UsuariosTable
            usuarios={paginatedUsuarios}
            onToggleEstado={handleToggleEstado}
            onVerDetalles={openVerDetalles}
            onEditar={openEdit}
            onEliminar={openEliminar}
          />
        )}

        {!error && (
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            total={sortedUsuarios.length}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {showModal && (
        <ModalWrapper title="Nuevo Usuario" onClose={closeAll}>
          <FormUsuario formData={formData} setFormData={setFormData} isEditing={false} />
          <ModalFooter onCancel={closeAll} onSave={handleGuardarNuevo} saveLabel="Guardar Usuario" />
        </ModalWrapper>
      )}

      {showDetailModal && selectedUsuario && (
        <ModalWrapper title="Detalles del Usuario" onClose={closeAll}>
          <div className="grid grid-cols-2 gap-4">
            <DetailField label="Nombre" value={`${selectedUsuario.nombre} ${selectedUsuario.apellido}`} />
            <DetailField label="Documento" value={selectedUsuario.numero_documento ? `${selectedUsuario.tipo_documento || ""}-${selectedUsuario.numero_documento}` : ""} />
            <DetailField label="Correo" value={selectedUsuario.email} />
            <DetailField label="Teléfono" value={selectedUsuario.telefono} />
            <DetailField label="Dirección" value={selectedUsuario.direccion} />
            <DetailField label="Rol" value={getRolNombre(selectedUsuario.id_rol)} />
            <DetailField label="Estado" value={selectedUsuario.estado === "anulado" ? "Anulado" : selectedUsuario.estado === "inactivo" ? "Inactivo" : "Activo"} />
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <button onClick={closeAll} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              Cerrar
            </button>
            <button onClick={() => openEdit(selectedUsuario)} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors">
              Editar Usuario
            </button>
          </div>
        </ModalWrapper>
      )}

      {showEditModal && selectedUsuario && (
        <ModalWrapper title="Editar Usuario" onClose={closeAll}>
          <FormUsuario formData={formData} setFormData={setFormData} isEditing />
          {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
          <ModalFooter onCancel={closeAll} onSave={handleGuardarEdicion} saveLabel="Guardar Cambios" />
        </ModalWrapper>
      )}

      {showDeleteModal && selectedUsuario && (
        <ModalWrapper title="Anular Usuario" onClose={closeAll}>
          <div className="flex items-center gap-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <Ban className="w-8 h-8 text-destructive shrink-0" />
            <div>
              <p className="font-medium">¿Estás seguro de anular este usuario?</p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>{selectedUsuario.nombre} {selectedUsuario.apellido}</strong> quedará anulado y podrá consultarse desde el filtro de anulados.
              </p>
            </div>
          </div>
          {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <button onClick={closeAll} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              Cancelar
            </button>
            <button onClick={handleConfirmarEliminar} className="px-6 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition-opacity">
              Sí, Anular
            </button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}
