import { Plus, Ban } from "lucide-react";
import { useCompras } from "../hooks/useCompras";
import { StatsRow } from "../components/StatsRow";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { FilterPanel } from "../components/FilterPanel";
import { ComprasTable } from "../components/ComprasTable";
import { ModalWrapper } from "../components/ModalWrapper";
import { ModalFooter } from "../components/ModalFooter";
import { FormCompra } from "../components/FormCompra";
import { DetailField } from "../components/DetailField";
import { PaginationBar } from "../../components/PaginationBar";
import { estadoConfig } from "../services/comprasData";
import { getProveedorNombre } from "../../proveedores/services/proveedoresData";

export default function ComprasPage() {
  const {
    compras, searchTerm, filterEstado, setFilterEstado,
    filterCategoria, setFilterCategoria, showFilters, setShowFilters,
    showModal, showDetailModal, showEditModal, showAnularModal, selected, formData, setFormData,
    filtered, stats, currentPage, setCurrentPage, totalPages, startIndex, endIndex, paginatedCompras,
    handleNuevo, handleGuardarNuevo, handleVerDetalles, handleEditar,
    handleGuardarEdicion, handleAnular, handleConfirmarAnular, handleCambiarEstado, closeAll, clearFilters,
    handleSearchChange, handleFilterEstadoChange, handleFilterCategoriaChange,
  } = useCompras();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Gestión de Compras</h1>
          <p className="text-muted-foreground mt-1">Control de pedidos y compras a proveedores</p>
        </div>
        <button onClick={handleNuevo} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors">
          <Plus className="w-5 h-5" /> Nueva Compra
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
            filterCategoria={filterCategoria}
            onFilterCategoriaChange={handleFilterCategoriaChange}
            onClear={clearFilters}
            />
          }
        />

        <ComprasTable compras={paginatedCompras} onVerDetalles={handleVerDetalles} onEditar={handleEditar} onAnular={handleAnular} onCambiarEstado={handleCambiarEstado} />

        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          total={filtered.length}
          onPageChange={setCurrentPage}
          itemName="compras"
        />
      </div>

      {showModal && (
        <ModalWrapper title="Nueva Compra" onClose={closeAll} maxWidth="max-w-6xl" tall>
          <FormCompra formData={formData} setFormData={setFormData} />
          <ModalFooter onCancel={closeAll} onSave={handleGuardarNuevo} saveLabel="Guardar Compra" />
        </ModalWrapper>
      )}

      {showDetailModal && selected && (
        <ModalWrapper title="Detalles de la Compra" onClose={closeAll}>
          <div className="grid grid-cols-2 gap-4">
            <DetailField label="N° Compra" value={`#${selected.id_compra}`} />
            <DetailField label="Proveedor" value={selected.id_proveedor ? getProveedorNombre(selected.id_proveedor) : "—"} />
            <DetailField label="Total" value={`$${Number(selected.total).toFixed(2)}`} />
            <DetailField label="Estado" value={estadoConfig[selected.estado].label} />
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Repuestos de la Compra</p>
            {selected.items && selected.items.length > 0 ? (
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-accent/50">
                    <tr className="text-left">
                      <th className="px-3 py-2 font-medium">Repuesto</th>
                      <th className="px-3 py-2 font-medium">Cantidad</th>
                      <th className="px-3 py-2 font-medium">Costo Unit.</th>
                      <th className="px-3 py-2 font-medium text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {selected.items.map((it) => (
                      <tr key={it.id_repuesto}>
                        <td className="px-3 py-2">{it.nombre}</td>
                        <td className="px-3 py-2">{it.cantidad}</td>
                        <td className="px-3 py-2">${Number(it.costo_unitario).toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">${(Number(it.costo_unitario) * Number(it.cantidad)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No se registraron repuestos para esta compra.</p>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <button onClick={closeAll} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Cerrar</button>
            <button onClick={() => handleEditar(selected)} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors">Editar Compra</button>
          </div>
        </ModalWrapper>
      )}

      {showEditModal && selected && (
        <ModalWrapper title="Editar Compra" onClose={closeAll} maxWidth="max-w-6xl" tall>
          <FormCompra formData={formData} setFormData={setFormData} />
          <ModalFooter onCancel={closeAll} onSave={handleGuardarEdicion} saveLabel="Guardar Cambios" />
        </ModalWrapper>
      )}

      {showAnularModal && selected && (
        <ModalWrapper title="Anular Compra" onClose={closeAll}>
          <div className="flex items-center gap-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <Ban className="w-8 h-8 text-destructive shrink-0" />
            <div>
              <p className="font-medium">¿Estás seguro de anular esta compra?</p>
              <p className="text-sm text-muted-foreground mt-1">La compra <strong>#{selected.id_compra}</strong>{selected.id_proveedor ? <> de <strong>{getProveedorNombre(selected.id_proveedor)}</strong></> : null} se conservará como anulada.</p>
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
