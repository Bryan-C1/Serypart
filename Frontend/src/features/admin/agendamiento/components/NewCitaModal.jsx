import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createServicio } from "../../servicios/services/serviciosService";
import { reportInvalidField } from "../../../../shared/utils/inputValidation";
import { SearchableSelect } from "../../../../shared/ui/searchable-select";

const emptyForm = { id_vehiculo: "", id_cliente: "", fecha_cita: "", hora_cita: "", estado: "programada", observaciones: "" };

export function NewCitaModal({ open, onClose, onSave, initialData, initialDate, catalogs, catalogsLoading, catalogsError, onRefreshCatalogs, saving }) {
  const [form, setForm] = useState(emptyForm);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [servicioActual, setServicioActual] = useState("");
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [mostrarCrearServicio, setMostrarCrearServicio] = useState(false);
  const [servicioNuevo, setServicioNuevo] = useState({ nombre: "", descripcion: "", precio: "" });
  const [error, setError] = useState("");
  const [creandoServicio, setCreandoServicio] = useState(false);
  const clientes = catalogs.clientes;
  const vehiculos = catalogs.vehiculos;

  useEffect(() => {
    if (!open) return;
    const datosIniciales = initialData || {};
    const serviciosIniciales = datosIniciales.servicios?.length
      ? datosIniciales.servicios
      : serviciosDisponibles.filter((servicio) => String(servicio.id) === String(datosIniciales.id_servicio));
    setForm({ ...emptyForm, ...datosIniciales, fecha_cita: datosIniciales.fecha_cita || initialDate || "" });
    setServiciosSeleccionados(serviciosIniciales);
    setServicioActual("");
    setMostrarCrearServicio(false);
    setServicioNuevo({ nombre: "", descripcion: "", precio: "" });
    setError("");
  }, [open, initialData, initialDate]);

  useEffect(() => {
    setServiciosDisponibles(catalogs.servicios);
  }, [catalogs.servicios]);

  useEffect(() => {
    if (open) onRefreshCatalogs();
  }, [open, onRefreshCatalogs]);

  const field = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  if (!open) return null;

  const handleAgregarServicio = () => {
    if (!servicioActual) return;
    const servicio = serviciosDisponibles.find((s) => String(s.id) === String(servicioActual));
    if (!servicio) return;
    if (serviciosSeleccionados.some((s) => s.id === servicio.id)) return;
    setServiciosSeleccionados((prev) => [...prev, servicio]);
    setServicioActual("");
  };

  const handleQuitarServicio = (id) => {
    setServiciosSeleccionados((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCrearServicio = async () => {
    if (!servicioNuevo.nombre.trim() || Number(servicioNuevo.precio) <= 0) return;
    setCreandoServicio(true);
    setError("");
    try {
      const nuevoServicio = await createServicio({
        nombre: servicioNuevo.nombre.trim(),
        descripcion: servicioNuevo.descripcion.trim(),
        precio: Number(servicioNuevo.precio),
        duracion_estimada: "",
        estado: "activo",
        id_tipo_vehiculo: Number(vehiculoSeleccionado?.id_tipo_vehiculo || 1),
      });
      setServiciosDisponibles((current) => [...current, nuevoServicio]);
      setServicioActual(String(nuevoServicio.id));
      setServicioNuevo({ nombre: "", descripcion: "", precio: "" });
      setMostrarCrearServicio(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCreandoServicio(false);
    }
  };

  const handleClose = () => {
    setForm(emptyForm);
    setServiciosSeleccionados([]);
    setServicioActual("");
    onClose();
  };

  const handleProgramar = async () => {
    if (serviciosSeleccionados.length === 0 || !form.fecha_cita || !form.hora_cita) return;
    const saved = await onSave(form, serviciosSeleccionados);
    if (!saved) return;
    setForm(emptyForm);
    setServiciosSeleccionados([]);
    setServicioActual("");
  };

  const vehiculosCliente = vehiculos.filter((vehiculo) => String(vehiculo.id_cliente) === String(form.id_cliente));
  const vehiculoSeleccionado = vehiculos.find((vehicle) => String(vehicle.id) === String(form.id_vehiculo));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-6xl w-full max-h-[92vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
          <h2 className="text-xl font-semibold">{initialData ? "Editar Cita" : "Nueva Cita"}</h2>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[minmax(15rem,0.34fr)_minmax(0,1fr)]">
          <div className="order-2 rounded-lg border border-border p-4 md:order-2 md:col-start-2 md:row-span-3 md:row-start-1">
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium">Servicios</label>
              <button type="button" onClick={() => setMostrarCrearServicio(true)} className="text-sm text-primary hover:text-secondary transition-colors">
                Crear servicio
              </button>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <SearchableSelect
                value={servicioActual}
                onChange={(e) => setServicioActual(e.target.value)}
                disabled={catalogsLoading || Boolean(catalogsError)}
                placeholder={catalogsLoading ? "Cargando servicios..." : "Seleccionar servicio"}
                className="min-w-0 w-full px-4 py-2.5 text-base bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Seleccionar servicio</option>
                {serviciosDisponibles
                  .filter((servicio) => !serviciosSeleccionados.some((s) => s.id === servicio.id))
                  .map((servicio) => <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>)}
              </SearchableSelect>
              <button
                type="button"
                onClick={handleAgregarServicio}
                disabled={!servicioActual}
                className="shrink-0 px-4 py-2 text-base bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar
              </button>
            </div>
            {serviciosSeleccionados.length > 0 && (
              <div className="mt-4 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-accent/50">
                    <tr className="text-left">
                      <th className="px-3 py-2 font-medium">Nombre</th>
                      <th className="px-3 py-2 font-medium">Descripción</th>
                      <th className="px-3 py-2 text-right font-medium">
                        <button
                          type="button"
                          onClick={() => setServiciosSeleccionados([])}
                          className="text-destructive hover:underline"
                        >
                          Quitar
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {serviciosSeleccionados.map((servicio) => (
                      <tr key={servicio.id}>
                        <td className="px-3 py-2">{servicio.nombre}</td>
                        <td className="px-3 py-2">{servicio.descripcion || "—"}</td>
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleQuitarServicio(servicio.id)}
                            className="rounded-md px-2 py-1 text-destructive hover:bg-destructive/10"
                          >
                            Quitar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-border bg-accent/30">
                    <tr>
                      <td colSpan="2" className="px-3 py-3 text-right font-semibold">Total de servicios</td>
                      <td className="px-3 py-3 text-right font-semibold text-primary">{serviciosSeleccionados.length}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
          <div className="order-1 grid grid-cols-1 gap-4 md:order-1 md:col-start-1 md:row-start-1">
            <h3 className="text-base font-semibold">Datos de la cita</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Cliente</label>
              <SearchableSelect value={form.id_cliente} onChange={(event) => setForm((current) => ({ ...current, id_cliente: event.target.value, id_vehiculo: "" }))} required disabled={catalogsLoading || Boolean(catalogsError)} placeholder={catalogsLoading ? "Cargando clientes..." : "Seleccionar cliente"} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Seleccionar cliente</option>
                {clientes.map((cliente) => <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>)}
              </SearchableSelect>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Vehículo</label>
              <SearchableSelect value={form.id_vehiculo} onChange={field("id_vehiculo")} required disabled={!form.id_cliente || catalogsLoading || Boolean(catalogsError)} disabledClassName="disabled:cursor-not-allowed disabled:opacity-50" placeholder={catalogsLoading ? "Cargando vehículos..." : "Seleccionar vehículo"} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Seleccionar vehículo</option>
                {vehiculosCliente.map((vehiculo) => <option key={vehiculo.id} value={vehiculo.id}>{vehiculo.nombre}</option>)}
              </SearchableSelect>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fecha de la Cita</label>
              <input type="date" value={form.fecha_cita} onChange={field("fecha_cita")} required className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hora de la Cita</label>
              <input type="time" value={form.hora_cita} onChange={field("hora_cita")} required className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <SearchableSelect value={form.estado} onChange={field("estado")} required searchable={false} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="programada">Programada</option>
                <option value="en_proceso">En Proceso</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </SearchableSelect>
            </div>
          </div>
          {vehiculoSeleccionado && (
            <div className="order-3 grid grid-cols-1 gap-3 rounded-lg border border-border bg-accent/30 p-4 text-sm md:col-start-1 md:row-start-2">
              <div><span className="text-muted-foreground">Vehículo:</span> <strong>{vehiculoSeleccionado.nombre}</strong></div>
              <div><span className="text-muted-foreground">Placa:</span> <strong>{vehiculoSeleccionado.placa}</strong></div>
              <div><span className="text-muted-foreground">Estado:</span> <strong>{vehiculoSeleccionado.estado}</strong></div>
              {form.estado === "completada" && (
                <div><span className="text-muted-foreground">Saldo a deber:</span> <strong>${Number(vehiculoSeleccionado.saldo_a_deber).toFixed(2)}</strong></div>
              )}
            </div>
          )}
          {catalogsError && (
            <div role="alert" className="order-4 flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive md:col-span-2">
              <span>{catalogsError}</span>
              <button type="button" onClick={onRefreshCatalogs} className="shrink-0 font-medium underline">Reintentar</button>
            </div>
          )}
          {error && <div role="alert" className="order-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive md:col-span-2">{error}</div>}
          <div className="order-4 md:col-start-1 md:row-start-3">
            <label className="block text-sm font-medium mb-2">Observaciones</label>
            <textarea value={form.observaciones} onChange={field("observaciones")} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" rows={3} placeholder="Observaciones adicionales sobre la cita..."></textarea>
          </div>
        </div>
        <div className="p-6 border-t border-border flex justify-end gap-3">
          <button onClick={handleClose} className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => reportInvalidField() && handleProgramar()}
            disabled={saving || catalogsLoading || serviciosSeleccionados.length === 0 || !form.id_cliente || !form.id_vehiculo || !form.fecha_cita || !form.hora_cita}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando..." : initialData ? "Guardar cambios" : "Programar Cita"}
          </button>
        </div>
      </div>

      {mostrarCrearServicio && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-card border border-border rounded-lg max-w-md w-full shadow-xl">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold">Crear servicio</h2>
              <button type="button" onClick={() => setMostrarCrearServicio(false)} className="text-muted-foreground hover:text-foreground" aria-label="Cerrar crear servicio">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre del servicio *</label>
                <input type="text" value={servicioNuevo.nombre} onChange={(event) => setServicioNuevo((current) => ({ ...current, nombre: event.target.value }))} required className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <textarea value={servicioNuevo.descripcion} onChange={(event) => setServicioNuevo((current) => ({ ...current, descripcion: event.target.value }))} rows={3} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Precio *</label>
                <input type="number" min="0.01" step="0.01" value={servicioNuevo.precio} onChange={(event) => setServicioNuevo((current) => ({ ...current, precio: event.target.value }))} required className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button type="button" onClick={() => setMostrarCrearServicio(false)} className="px-5 py-2 border border-border rounded-lg hover:bg-accent transition-colors">Cancelar</button>
              <button type="button" onClick={handleCrearServicio} disabled={creandoServicio || !servicioNuevo.nombre.trim() || Number(servicioNuevo.precio) <= 0} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{creandoServicio ? "Guardando..." : "Guardar servicio"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
