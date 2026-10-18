import { Plus, Ban } from "lucide-react";
import { useRef } from "react";
import { useVentas } from "../hooks/useVentas";
import { StatsRow } from "../components/StatsRow";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { FilterPanel } from "../components/FilterPanel";
import { VentasTable } from "../components/VentasTable";
import { ModalWrapper } from "../components/ModalWrapper";
import { ModalFooter } from "../components/ModalFooter";
import { FormVenta } from "../components/FormVenta";
import { DetailField } from "../components/DetailField";
import { PaginationBar } from "../../components/PaginationBar";
import { estadoConfig, getMetodoPagoNombre } from "../services/ventasData";
import { getUsuarioNombre } from "../../vehiculos/services/vehiculosData";

export default function VentasPage() {
  const saleFormRef = useRef(null);
  const {
    ventas, searchTerm, filterEstado, setFilterEstado, error, loading, loadVentas, metodosPago, updatingSaleId,
    filterMetodo, setFilterMetodo, showFilters, setShowFilters,
    showModal, showDetailModal, showEditModal, showCancelModal, showActivateModal, activationStatus, selected, formData, setFormData,
    filtered, stats, currentPage, setCurrentPage, totalPages, startIndex, endIndex, paginatedVentas,
    handleNuevo, handleGuardarNuevo, handleVerDetalles, handleEditar,
    handleGuardarEdicion, handleAnular, handleConfirmarAnular, handleCambiarEstado, handleConfirmarActivacion, closeAll, clearFilters,
    handleSearchChange, handleFilterEstadoChange, handleFilterMetodoChange,
  } = useVentas();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Gestión de Ventas</h1>
          <p className="text-muted-foreground mt-1">Registro y seguimiento de ventas del taller</p>
        </div>
        <button onClick={handleNuevo} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors">
          <Plus className="w-5 h-5" /> Nueva Venta
        </button>
      </div>

      {error && !showModal && !showEditModal && !showCancelModal && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <span>{error}</span>
          {!ventas.length && <button type="button" onClick={loadVentas} className="font-medium underline">Reintentar</button>}
        </div>
      )}

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
            filterMetodo={filterMetodo}
            onFilterMetodoChange={handleFilterMetodoChange}
            metodosPago={metodosPago}
            onClear={clearFilters}
            />
          }
        />

        {loading
          ? <div role="status" className="py-10 text-center text-muted-foreground">Cargando ventas...</div>
          : <VentasTable
            ventas={paginatedVentas}
            onVerDetalles={handleVerDetalles}
            onEditar={handleEditar}
            onAnular={handleAnular}
            onCambiarEstado={handleCambiarEstado}
            updatingSaleId={updatingSaleId}
          />}

        {!loading && <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          total={filtered.length}
          onPageChange={setCurrentPage}
          itemName="ventas"
        />}
      </div>

      {showModal && (
        <ModalWrapper title="Nueva Venta" onClose={closeAll} maxWidth="max-w-6xl" tall>
          {error && <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <div ref={saleFormRef}>
            <FormVenta formData={formData} setFormData={setFormData} />
            <ModalFooter validationRoot={saleFormRef} onCancel={closeAll} onSave={handleGuardarNuevo} saveLabel="Guardar Venta" />
          </div>
        </ModalWrapper>
      )}

      {showDetailModal && selected && (
        <ModalWrapper title="Detalles de la Venta" onClose={closeAll}>
          <div className="grid grid-cols-2 gap-4">
            <DetailField label="Cliente" value={selected.nombre_usuario || getUsuarioNombre(selected.id_cliente)} />
            <DetailField label="Método de Pago" value={selected.nombre_metodo_pago || getMetodoPagoNombre(selected.id_metodo_pago)} />
            <DetailField label="Total" value={`$${Number(selected.total).toFixed(2)}`} />
            <DetailField label="Estado" value={estadoConfig[selected.estado]?.label || selected.estado} />
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Repuestos Vendidos</p>
            {selected.items && selected.items.length > 0 ? (
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-accent/50">
                    <tr className="text-left">
                      <th className="px-3 py-2 font-medium">Repuesto</th>
                      <th className="px-3 py-2 font-medium">Cantidad</th>
                      <th className="px-3 py-2 font-medium">Precio Unit.</th>
                      <th className="px-3 py-2 font-medium text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {selected.items.map((it) => (
                      <tr key={it.id_repuesto}>
                        <td className="px-3 py-2">{it.nombre}</td>
                        <td className="px-3 py-2">{it.cantidad}</td>
                        <td className="px-3 py-2">${Number(it.precio_unitario).toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">${(Number(it.precio_unitario) * Number(it.cantidad)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-border bg-accent/30">
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-right font-semibold">Total</td>
                      <td className="px-3 py-2 text-right font-semibold text-primary">${selected.items.reduce((sum, item) => sum + Number(item.subtotal || (Number(item.precio_unitario) * Number(item.cantidad)) || 0), 0).toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No se registraron repuestos para esta venta.</p>
            )}
            {selected.otherConceptsTotal > 0 && (
              <p className="mt-3 text-right text-sm text-muted-foreground">
                Servicios y otros conceptos incluidos en el total: ${selected.otherConceptsTotal.toFixed(2)}
              </p>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <button onClick={closeAll} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Cerrar</button>
            <button onClick={() => handleEditar(selected)} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors">Editar Venta</button>
          </div>
        </ModalWrapper>
      )}

      {showEditModal && selected && (
        <ModalWrapper title="Editar Venta" onClose={closeAll} maxWidth="max-w-6xl" tall>
          {error && <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <div ref={saleFormRef}>
            <FormVenta formData={formData} setFormData={setFormData} />
            <ModalFooter validationRoot={saleFormRef} onCancel={closeAll} onSave={handleGuardarEdicion} saveLabel="Guardar Cambios" />
          </div>
        </ModalWrapper>
      )}

      {showCancelModal && selected && (
        <ModalWrapper title="Anular Venta" onClose={closeAll}>
          {error && <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <div className="flex items-center gap-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <Ban className="w-8 h-8 text-destructive shrink-0" />
            <div>
              <p className="font-medium">¿Estás seguro de anular esta venta?</p>
              <p className="text-sm text-muted-foreground mt-1">La venta se conservará con estado cancelado.</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <button onClick={closeAll} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Cancelar</button>
            <button onClick={handleConfirmarAnular} className="px-6 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition-opacity">Sí, Anular</button>
          </div>
        </ModalWrapper>
      )}

      {showActivateModal && selected && (
        <ModalWrapper title="Activar Venta" onClose={closeAll}>
          {error && <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <div className="p-4 border border-border rounded-lg">
            <p className="font-medium">¿Estás seguro de que deseas activar esta venta?</p>
            <p className="text-sm text-muted-foreground mt-1">La venta volverá a la lista normal con estado {estadoConfig[activationStatus]?.label || activationStatus}.</p>
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <button onClick={closeAll} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Cancelar</button>
            <button onClick={handleConfirmarActivacion} disabled={updatingSaleId !== null} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors disabled:opacity-50">Sí, Activar</button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}
