import { Plus, Ban, Check, X as XIcon } from "lucide-react";
import { useRoles } from "../Hooks/useRoles";
import { StatsRow } from "../Components/StatsRow";
import { SearchFilterBar } from "../Components/SearchFilterBar";
import { FilterPanel } from "../Components/FilterPanel";
import { RolesTable } from "../Components/RolesTable";
import { PaginationBar } from "../Components/PaginationBar";
import { ModalWrapper } from "../Components/ModalWrapper";
import { ModalFooter } from "../Components/ModalFooter";
import { FormRole } from "../Components/FormRole";
import { DetailField } from "../Components/DetailField";
import { MODULOS, ACCIONES } from "../Services/rolesData";

export default function RolesPage() {
  const {
    searchTerm, filterEstado, showFilters, setShowFilters, sortBy,
    currentPage, setCurrentPage, totalPages, startIndex, endIndex,
    sortedRoles, paginatedRoles, stats,
    showModal, showDetailModal, showEditModal, showDeleteModal,
    selectedRole, formData, setFormData,
    handleSearchChange, handleFilterChange, handleSortChange, clearFilters,
    handleNuevo, handleGuardarNuevo, handleVerDetalles, handleEditar,
    handleGuardarEdicion, handleEliminar, handleConfirmarEliminar,
    handleToggleEstado, handleExportar, closeAll,
  } = useRoles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Gestión de Roles</h1>
          <p className="text-muted-foreground mt-1">Administra los roles y permisos del sistema</p>
        </div>
        <button
          onClick={handleNuevo}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Rol
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
          onExport={handleExportar}
          filterContent={<FilterPanel filterEstado={filterEstado} onFilterChange={handleFilterChange} onSelect={() => setShowFilters(false)} onClear={clearFilters} />}
        />

        <RolesTable
          roles={paginatedRoles}
          onToggleEstado={handleToggleEstado}
          onVerDetalles={handleVerDetalles}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />

        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          total={sortedRoles.length}
          onPageChange={setCurrentPage}
        />
      </div>

      {showModal && (
        <ModalWrapper title="Nuevo Rol" onClose={closeAll}>
          <FormRole formData={formData} setFormData={setFormData} />
          <ModalFooter onCancel={closeAll} onSave={handleGuardarNuevo} saveLabel="Guardar Rol" />
        </ModalWrapper>
      )}

      {showDetailModal && selectedRole && (
        <ModalWrapper title="Detalles del Rol" onClose={closeAll}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DetailField label="Nombre" value={selectedRole.nombre} />
              <DetailField label="Estado" value={selectedRole.estado === "anulado" ? "Anulado" : selectedRole.estado === "activo" ? "Activo" : "Inactivo"} />
              <DetailField label="Usuarios Asignados" value={selectedRole.usuariosAsignados} />
            </div>
            {selectedRole.descripcion && (
              <DetailField label="Descripción" value={selectedRole.descripcion} />
            )}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Permisos</p>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-72 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-accent/50 sticky top-0">
                      <tr className="text-left">
                        <th className="px-4 py-2 font-medium">Módulo</th>
                        {ACCIONES.map((a) => (
                          <th key={a.key} className="px-3 py-2 font-medium text-center">{a.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {MODULOS.map((m) => (
                        <tr key={m.key}>
                          <td className="px-4 py-2 font-medium">{m.label}</td>
                          {ACCIONES.map((a) => (
                            <td key={a.key} className="px-3 py-2 text-center">
                              {selectedRole.permisos?.[m.key]?.[a.key] ? (
                                <Check className="w-4 h-4 text-success inline" />
                              ) : (
                                <XIcon className="w-4 h-4 text-muted-foreground/40 inline" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <button onClick={closeAll} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              Cerrar
            </button>
            <button onClick={() => { handleEditar(selectedRole); }} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors">
              Editar Rol
            </button>
          </div>
        </ModalWrapper>
      )}

      {showEditModal && selectedRole && (
        <ModalWrapper title="Editar Rol" onClose={closeAll}>
          <FormRole formData={formData} setFormData={setFormData} />
          <ModalFooter onCancel={closeAll} onSave={handleGuardarEdicion} saveLabel="Guardar Cambios" />
        </ModalWrapper>
      )}

      {showDeleteModal && selectedRole && (
        <ModalWrapper title="Anular Rol" onClose={closeAll} maxWidth="max-w-md">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <Ban className="w-8 h-8 text-destructive shrink-0" />
              <div>
                <p className="font-medium">¿Estás seguro de anular este rol?</p>
                <p className="text-sm text-muted-foreground mt-1">El rol <strong>{selectedRole.nombre}</strong> quedará anulado y podrá consultarse desde el filtro de anulados.</p>
              </div>
            </div>
          </div>
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
