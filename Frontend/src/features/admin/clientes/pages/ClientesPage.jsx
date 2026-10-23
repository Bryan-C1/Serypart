import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClientes } from "../hooks/useClientes";
import { getVehiculos } from "../../vehiculos/services/vehiculosService";
import { StatsRow } from "../components/StatsRow";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { FilterPanel } from "../components/FilterPanel";
import { ClientesTable } from "../components/ClientesTable";
import { PaginationBar } from "../components/PaginationBar";
import { ModalWrapper } from "../components/ModalWrapper";
import { ModalFooter } from "../components/ModalFooter";
import { FormCliente } from "../components/FormCliente";
import { DetailField } from "../components/DetailField";

export default function ClientesPage() {
  const navigate = useNavigate();
  const [vehiculosCliente, setVehiculosCliente] = useState(null);
  const [vehiculosLoading, setVehiculosLoading] = useState(false);
  const [vehiculosError, setVehiculosError] = useState("");
  const [vehiculos, setVehiculos] = useState([]);
  const {
    searchTerm, filterEstado, showFilters, setShowFilters, sortBy,
    currentPage, setCurrentPage, totalPages, startIndex, endIndex,
    sortedClientes, paginatedClientes, stats,
    loading, error, loadClientes,
    showModal, showDetailModal, showEditModal, showDeleteModal,
    selectedCliente, formData, setFormData,
    handleSearchChange, handleFilterChange, handleSortChange, clearFilters,
    handleNuevo, handleGuardarNuevo, handleVerDetalles, handleEditar,
    handleGuardarEdicion, handleEliminar, handleConfirmarEliminar,
    handleToggleEstado, closeAll,
  } = useClientes();

  const abrirVehiculosCliente = async (cliente) => {
    setVehiculosCliente(cliente);
    setVehiculos([]);
    setVehiculosLoading(true);
    setVehiculosError("");
    try {
      const rows = await getVehiculos();
      setVehiculos(rows.filter((vehiculo) => Number(vehiculo.id_cliente) === Number(cliente.id)));
    } catch (requestError) {
      setVehiculosError(requestError.message);
    } finally {
      setVehiculosLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Gestión de Clientes</h1>
          <p className="text-muted-foreground mt-1">Administra la información de tus clientes</p>
        </div>
        <button
          onClick={handleNuevo}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground transition-colors hover:bg-secondary sm:px-4 sm:text-base"
        >
          <Plus className="w-5 h-5" />
          Nuevo Cliente
        </button>
      </div>

      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <span>{error}</span>
          <button type="button" onClick={loadClientes} className="font-medium underline">Reintentar</button>
        </div>
      )}

      <StatsRow stats={stats} />

      <div className="rounded-lg border border-border bg-card p-3 shadow-sm sm:p-6">
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
          <p role="status" className="py-10 text-center text-muted-foreground">Cargando clientes...</p>
        ) : (
          <ClientesTable
            clientes={paginatedClientes}
            onToggleEstado={handleToggleEstado}
            onVerDetalles={handleVerDetalles}
            onVerVehiculos={abrirVehiculosCliente}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
          />
        )}

        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          total={sortedClientes.length}
          onPageChange={setCurrentPage}
        />
      </div>

      {showModal && (
        <ModalWrapper title="Nuevo Cliente" onClose={closeAll}>
          {error && <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <FormCliente formData={formData} setFormData={setFormData} />
          <ModalFooter onCancel={closeAll} onSave={handleGuardarNuevo} saveLabel="Guardar Cliente" />
        </ModalWrapper>
      )}

      {showDetailModal && selectedCliente && (
        <ModalWrapper title="Detalles del Cliente" onClose={closeAll}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DetailField label="Tipo de documento" value={selectedCliente.tipoDocumento} />
              <DetailField label="Número de documento" value={selectedCliente.numeroDocumento} />
              <DetailField label="Nombre" value={selectedCliente.nombre} />
              <DetailField label="Apellido" value={selectedCliente.apellido} />
              <DetailField label="Teléfono" value={selectedCliente.telefono} />
              <DetailField label="Dirección" value={selectedCliente.direccion} />
              <DetailField label="Estado" value={selectedCliente.estado === "anulado" ? "Anulado" : selectedCliente.estado === "activo" ? "Activo" : "Inactivo"} />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <button onClick={closeAll} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              Cerrar
            </button>
            <button onClick={() => { handleEditar(selectedCliente); }} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors">
              Editar Cliente
            </button>
            <button
              onClick={() => abrirVehiculosCliente(selectedCliente)}
              className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
            >
              Ver Vehículos
            </button>
            <button
              onClick={() => { closeAll(); navigate(`/agendamiento?cliente=${selectedCliente.id}`); }}
              className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
            >
              Ver Servicios
            </button>
          </div>
        </ModalWrapper>
      )}

      {showEditModal && selectedCliente && (
        <ModalWrapper title="Editar Cliente" onClose={closeAll}>
          {error && <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <FormCliente formData={formData} setFormData={setFormData} />
          <ModalFooter onCancel={closeAll} onSave={handleGuardarEdicion} saveLabel="Guardar Cambios" />
        </ModalWrapper>
      )}

      {showDeleteModal && selectedCliente && (
        <ModalWrapper title="Eliminar Cliente" onClose={closeAll}>
          {error && <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <Trash2 className="w-8 h-8 text-destructive shrink-0" />
              <div>
                <p className="font-medium">¿Estás seguro de eliminar este cliente?</p>
                <p className="text-sm text-muted-foreground mt-1">El cliente <strong>{selectedCliente.nombre}</strong> se eliminará permanentemente.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <button onClick={closeAll} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              Cancelar
            </button>
            <button onClick={handleConfirmarEliminar} className="px-6 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition-opacity">
              Sí, eliminar
            </button>
          </div>
        </ModalWrapper>
      )}

      {vehiculosCliente && (
        <ModalWrapper
          title={`Vehículos de ${vehiculosCliente.nombre}`}
          onClose={() => setVehiculosCliente(null)}
        >
          {vehiculosError && (
            <div role="alert" className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <span>{vehiculosError}</span>
              <button type="button" onClick={() => abrirVehiculosCliente(vehiculosCliente)} className="font-medium underline">Reintentar</button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="pb-3 font-medium">Placa</th>
                  <th className="pb-3 font-medium">Marca / Modelo</th>
                  <th className="pb-3 font-medium">Año</th>
                  <th className="pb-3 font-medium">Color</th>
                  <th className="pb-3 font-medium">Tipo</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {vehiculosLoading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Cargando vehículos...</td></tr>
                ) : vehiculos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Este cliente no tiene vehículos registrados.
                    </td>
                  </tr>
                ) : (
                  vehiculos.map((vehiculo) => (
                      <tr key={vehiculo.id}>
                        <td className="py-3 font-medium">{vehiculo.placa}</td>
                        <td className="py-3">
                          {vehiculo.marca || "—"} / {vehiculo.modelo || "—"}
                        </td>
                        <td className="py-3">{vehiculo.año}</td>
                        <td className="py-3">{vehiculo.color}</td>
                        <td className="py-3">{vehiculo.tipo_vehiculo || "—"}</td>
                        <td className="py-3">
                          <span className={`rounded-full px-2 py-1 text-xs ${vehiculo.estado === "activo" ? "bg-success/10 text-success" : vehiculo.estado === "en_servicio" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>
                            {vehiculo.estado === "anulado" ? "Anulado" : vehiculo.estado === "en_servicio" ? "En Servicio" : vehiculo.estado === "inactivo" ? "Inactivo" : "Activo"}
                          </span>
                        </td>
                      </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}
