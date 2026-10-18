import {
  Plus,
  Tag,
  Search,
  Filter,
  Download,
  Ban,
} from "lucide-react";
import { useRepuestos } from "../hooks/useRepuestos";
import { StatsRow } from "../components/StatsRow";
import { RepuestosTable } from "../components/RepuestosTable";
import { ModalWrapper } from "../components/ModalWrapper";
import { ModalFooter } from "../components/ModalFooter";
import { FormRepuesto } from "../components/FormRepuesto";
import { DetailField } from "../components/DetailField";
import { PaginationBar } from "../../components/PaginationBar";
import { useState } from "react";
import { FilterOptionsList } from "../../../../shared/ui/filter-options-list";

export default function RepuestosPage() {
  const {
    repuestos,
    marcas,
    getMarcaNombre,
    searchTerm,
    filteredRepuestos,
    lowStockCount,
    filterEstado,
    showFilter,
    setShowFilter,
    showModal,
    showMarcaModal,
    setShowMarcaModal,
    showAnularModal,
    showEditModal,
    showDetailModal,
    selectedRepuesto,
    formData,
    setFormData,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    endIndex,
    paginatedRepuestos,
    handleNuevo,
    handleGuardarNuevo,
    handleVerDetalles,
    handleEditar,
    handleCambiarEstado,
    handleReactivar,
    handleGuardarEdicion,
    handleAnular,
    handleConfirmarAnular,
    handleAgregarMarca,
    closeAll,
    handleSearchChange,
    handleFilterChange,
  } = useRepuestos();

  const FILTER_OPTIONS = ["todos", "disponible", "bajo_stock", "agotado", "anulados"];
  const filterLabels = {
    todos: "Todos",
    disponible: "Disponible",
    bajo_stock: "Stock Bajo",
    agotado: "Agotado",
    anulados: "Anulados",
  };

  const [nuevaMarca, setNuevaMarca] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Gestión de Repuestos</h1>
          <p className="text-muted-foreground mt-1">
            Administra el inventario de repuestos y partes
          </p>
        </div>
        <button
          onClick={handleNuevo}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors">
          <Plus className="w-5 h-5" />
          Nuevo Repuesto
        </button>
      </div>

      <StatsRow repuestos={repuestos} lowStockCount={lowStockCount} />

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              <Filter className="w-5 h-5" />
              Filtros{" "}
              {filterEstado !== "todos" && (
                <span className="w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
            {showFilter && (
              <div className="absolute left-0 top-full z-10 mt-2 w-40 shadow-lg">
                <FilterOptionsList
                  value={filterEstado}
                  onChange={handleFilterChange}
                  onSelect={() => setShowFilter(false)}
                  options={FILTER_OPTIONS.map((option) => ({ value: option, label: filterLabels[option] }))}
                />
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setNuevaMarca("");
              setShowMarcaModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
            <Tag className="w-5 h-5" />
            Registrar Marca
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
            <Download className="w-5 h-5" />
            Exportar
          </button>
        </div>

        <RepuestosTable
          repuestos={paginatedRepuestos}
          getMarcaNombre={getMarcaNombre}
          onVerDetalles={handleVerDetalles}
          onEditar={handleEditar}
          onAnular={handleAnular}
          onReactivar={handleReactivar}
          onCambiarEstado={handleCambiarEstado}
        />

        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          total={filteredRepuestos.length}
          onPageChange={setCurrentPage}
          itemName="repuestos"
        />
      </div>

      {showModal && (
        <ModalWrapper title="Nuevo Repuesto" onClose={closeAll}>
          <FormRepuesto
            formData={formData}
            setFormData={setFormData}
            marcas={marcas}
          />
          <ModalFooter
            onCancel={closeAll}
            onSave={handleGuardarNuevo}
            saveLabel="Guardar Repuesto"
          />
        </ModalWrapper>
      )}

      {showDetailModal && selectedRepuesto && (
        <ModalWrapper title="Detalles del Repuesto" onClose={closeAll}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DetailField label="Nombre" value={selectedRepuesto.nombre} />
              <DetailField
                label="Descripción"
                value={selectedRepuesto.descripcion}
              />
              <DetailField
                label="Marca del Repuesto"
                value={getMarcaNombre(selectedRepuesto.id_marca_repuesto)}
              />
              <DetailField
                label="Stock Actual"
                value={`${selectedRepuesto.stock} unidades`}
              />
              <DetailField
                label="Stock Mínimo"
                value={`${selectedRepuesto.stock_minimo} unidades`}
              />
              <DetailField
                label="Precio Unitario"
                value={`$${Number(selectedRepuesto.precio_unitario).toFixed(2)}`}
              />
              <DetailField
                label="Estado"
                value={
                  selectedRepuesto.estado === "anulado"
                    ? "Anulado"
                    : selectedRepuesto.estado === "disponible"
                      ? "Disponible"
                      : selectedRepuesto.estado === "bajo_stock"
                        ? "Stock Bajo"
                        : "Agotado"
                }
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <button
              onClick={closeAll}
              className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              Cerrar
            </button>
            <button
              onClick={() => handleEditar(selectedRepuesto)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors">
              Editar Repuesto
            </button>
          </div>
        </ModalWrapper>
      )}

      {showEditModal && selectedRepuesto && (
        <ModalWrapper title="Editar Repuesto" onClose={closeAll}>
          <FormRepuesto
            formData={formData}
            setFormData={setFormData}
            marcas={marcas}
          />
          <ModalFooter
            onCancel={closeAll}
            onSave={handleGuardarEdicion}
            saveLabel="Guardar Cambios"
          />
        </ModalWrapper>
      )}

      {showAnularModal && selectedRepuesto && (
        <ModalWrapper title="Anular Repuesto" onClose={closeAll}>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <Ban className="w-8 h-8 text-destructive shrink-0" />
              <div>
                <p className="font-medium">
                  ¿Estás seguro de anular este repuesto?
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>{selectedRepuesto.nombre}</strong> se conservará en el inventario con estado anulado.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <button
              onClick={closeAll}
              className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleConfirmarAnular}
              className="px-6 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition-opacity">
              Sí, Anular
            </button>
          </div>
        </ModalWrapper>
      )}

      {showMarcaModal && (
        <ModalWrapper
          title="Registrar Marca"
          onClose={() => setShowMarcaModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre de la Marca *
              </label>
              <input
                type="text"
                autoFocus
                value={nuevaMarca}
                onChange={e => setNuevaMarca(e.target.value)}
                placeholder="Ej: Bosch"
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <ModalFooter
            onCancel={() => setShowMarcaModal(false)}
            onSave={() => handleAgregarMarca(nuevaMarca)}
            saveLabel="Guardar Marca"
          />
        </ModalWrapper>
      )}
    </div>
  );
}
