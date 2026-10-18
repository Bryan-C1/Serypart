import { useEffect, useState } from "react";
import { CarFront, Plus, Trash2, UserRoundPlus } from "lucide-react";
import { apiRequest } from "../../../../shared/services/api";
import { createMetodoPago } from "../services/ventasService";
import { createCliente } from "../../clientes/services/clientesService";
import { useVehiculos } from "../../vehiculos/hooks/useVehiculos";
import { VehiculoFormModal } from "../../vehiculos/components/VehiculoFormModal";
import { ModalWrapper } from "./ModalWrapper";
import { CITAS_UPDATED_EVENT, getCitasGuardadas, getServicioNombre, getUsuarioNombre, getVehiculoNombre } from "../../agendamiento/services/agendamientoData";
import { getAgendamientoCatalogs, getCitas } from "../../agendamiento/services/agendamientoService";
import { SearchableSelect } from "../../../../shared/ui/searchable-select";
import { onlyDigits } from "../../../../shared/utils/inputValidation";

const inputCls = "w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring";

function filterCitasActivas(citas) {
  return citas.filter((cita) => !["cancelada", "anulada"].includes(String(cita.estado || "").toLowerCase()));
}

export function FormVenta({ formData, setFormData }) {
  const [repuestoActual, setRepuestoActual] = useState("");
  const [cantidadRepuestoActual, setCantidadRepuestoActual] = useState(1);
  const [servicioActual, setServicioActual] = useState("");
  const [cantidadServicioActual, setCantidadServicioActual] = useState(1);
  const [citasDisponibles, setCitasDisponibles] = useState(() => filterCitasActivas(getCitasGuardadas()));
  const [citasError, setCitasError] = useState("");
  const [catalogs, setCatalogs] = useState({ clientes: [], vehiculos: [], servicios: [], repuestos: [], metodosPago: [] });
  const [catalogsError, setCatalogsError] = useState("");
  const [catalogsLoading, setCatalogsLoading] = useState(true);
  const [itemError, setItemError] = useState("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentName, setPaymentName] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerSaving, setCustomerSaving] = useState(false);
  const [customerError, setCustomerError] = useState("");
  const [customerForm, setCustomerForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    tipo_documento: "CC",
    numero_documento: "",
    direccion: "",
  });
  const vehicleAdmin = useVehiculos();

  const loadCatalogs = async () => {
    setCatalogsLoading(true);
    setCatalogsError("");
    try {
      const [agendamiento, repuestos, metodosPago] = await Promise.all([
        getAgendamientoCatalogs(),
        apiRequest("/repuestos"),
        apiRequest("/metodos-pago"),
      ]);
      if (!Array.isArray(repuestos) || !Array.isArray(metodosPago)) {
        throw new Error("La API devolvió un formato inválido para los catálogos de ventas.");
      }
      setCatalogs({
        ...agendamiento,
        repuestos: repuestos.map((item) => ({
          ...item,
          id_repuesto: Number(item.id_repuesto),
          precio_unitario: Number(item.precio_unitario),
          stock: Number(item.stock),
        })),
        metodosPago: metodosPago.map((item) => ({
          id: Number(item.id_metodo_pago),
          nombre: item.nombre,
        })),
      });
    } catch (error) {
      setCatalogsError(error.message);
    } finally {
      setCatalogsLoading(false);
    }
  };

  const openCustomerModal = () => {
    setCustomerForm({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      tipo_documento: "CC",
      numero_documento: "",
      direccion: "",
    });
    setCustomerError("");
    setCustomerModalOpen(true);
  };

  const savePaymentMethod = async (event) => {
    event.preventDefault();
    const nombre = paymentName.trim();
    if (!nombre) {
      setPaymentError("Escribe el nombre del método de pago.");
      return;
    }

    setPaymentSaving(true);
    setPaymentError("");
    try {
      const existing = catalogs.metodosPago.find(
        (method) => method.nombre.trim().toLocaleLowerCase() === nombre.toLocaleLowerCase()
      );
      const method = existing || await createMetodoPago(nombre);
      if (!existing) {
        setCatalogs((current) => ({
          ...current,
          metodosPago: [...current.metodosPago, method],
        }));
      }
      setFormData((current) => ({ ...current, id_metodo_pago: method.id }));
      setPaymentModalOpen(false);
      setPaymentName("");
    } catch (error) {
      setPaymentError(error.message);
    } finally {
      setPaymentSaving(false);
    }
  };

  const saveCustomer = async (event) => {
    event.preventDefault();
    setCustomerSaving(true);
    setCustomerError("");
    try {
      const customer = await createCliente({
        ...customerForm,
        estado: "activo",
        fecha_registro: new Date().toISOString().slice(0, 10),
      });
      const customerId = Number(customer.id_cliente);
      if (!Number.isInteger(customerId) || customerId < 1) {
        throw new Error("La API no devolvió un identificador válido para el cliente.");
      }
      const customerOption = {
        id: customerId,
        nombre: [customer.nombre || customerForm.nombre, customer.apellido || customerForm.apellido].filter(Boolean).join(" "),
      };
      setCatalogs((current) => ({
        ...current,
        clientes: [...current.clientes.filter((item) => item.id !== customerId), customerOption],
      }));
      setFormData((current) => ({
        ...current,
        id_cliente: customerId,
        id_cita: "",
        cita_id_vehiculo: "",
      }));
      await vehicleAdmin.loadUsuarios();
      setCustomerModalOpen(false);
    } catch (error) {
      setCustomerError(error.message);
    } finally {
      setCustomerSaving(false);
    }
  };

  const openVehicleModal = () => {
    const customer = catalogs.clientes.find((item) => Number(item.id) === Number(formData.id_cliente));
    if (!customer) {
      setItemError("Selecciona un cliente antes de registrar un vehículo.");
      return;
    }
    vehicleAdmin.openCrear();
    vehicleAdmin.setForm((current) => ({
      ...current,
      id_cliente: Number(customer.id),
      nombre_cliente: customer.nombre,
    }));
  };

  const saveVehicleAndSelect = async () => {
    const vehicle = await vehicleAdmin.handleGuardar();
    if (!vehicle) return;
    setCatalogs((current) => ({
      ...current,
      vehiculos: [...current.vehiculos.filter((item) => item.id !== Number(vehicle.id)), {
        ...vehicle,
        id: Number(vehicle.id),
        nombre: vehicle.nombre || [vehicle.placa, vehicle.marca, vehicle.modelo].filter(Boolean).join(" "),
      }],
    }));
    setFormData((current) => ({
      ...current,
      id_cliente: Number(vehicle.id_cliente),
      cita_id_vehiculo: String(vehicle.id),
      tieneCita: false,
      id_cita: "",
    }));
  };

  useEffect(() => {
    loadCatalogs();
  }, []);

  useEffect(() => {
    let active = true;
    const actualizarCitas = () => setCitasDisponibles(filterCitasActivas(getCitasGuardadas()));
    getCitas()
      .then((records) => {
        if (active) setCitasDisponibles(filterCitasActivas(records));
      })
      .catch((error) => {
        if (active) setCitasError(error.message);
      });
    window.addEventListener(CITAS_UPDATED_EVENT, actualizarCitas);
    return () => {
      active = false;
      window.removeEventListener(CITAS_UPDATED_EVENT, actualizarCitas);
    };
  }, []);

  const field = (key) => (e) =>
    setFormData((prev) => ({
      ...prev,
      [key]: e.target.value === ""
        ? ""
        : ["id_detalle_venta", "id_venta", "id_cliente", "id_metodo_pago", "total"].includes(key)
        ? Number(e.target.value)
        : e.target.value,
    }));

  const items = formData.items || [];
  const totalItems = items.reduce((total, item) => total + Number(item.subtotal || 0), 0);
  const otherConceptsTotal = Number(formData.otherConceptsTotal || 0);
  const serviciosDisponibles = catalogs.servicios;
  const tieneCita = formData.tieneCita !== false;

  const handleTieneCitaChange = (hasAppointment) => {
    setFormData((prev) => ({
      ...prev,
      tieneCita: hasAppointment,
      id_cita: hasAppointment ? prev.id_cita : "",
      cita_estado: hasAppointment ? prev.cita_estado : "programada",
    }));
  };

  const handleCitaChange = (event) => {
    const idCita = event.target.value;
    const cita = citasDisponibles.find((item) => String(item.id) === String(idCita));
    if (!cita) {
      setFormData((prev) => ({ ...prev, id_cita: "", items: [] }));
      return;
    }

    const serviciosDeCita = cita.servicios?.length
      ? cita.servicios
      : cita.id_servicio
        ? [{ id: cita.id_servicio }]
        : [];
    const itemsDeCita = serviciosDeCita.map((servicio, index) => {
      const servicioCompleto = serviciosDisponibles.find((item) => item.id === Number(servicio.id));
      const precioUnitario = Number(servicioCompleto?.precio || 0);
      return {
        id_detalle_venta: Date.now() + index,
        id_venta: Number(formData.id_venta || 1),
        id_servicio: Number(servicio.id),
        nombre: servicioCompleto?.nombre || getServicioNombre(servicio.id),
        cantidad: 1,
        precio_unitario: precioUnitario,
        subtotal: precioUnitario,
        tipo: "servicio",
      };
    });

    setFormData((prev) => ({
      ...prev,
      id_cita: Number(cita.id),
      id_cliente: Number(cita.id_cliente),
      items: itemsDeCita,
    }));
  };

  const handleAgregarItem = () => {
    const cantidad = Number(cantidadRepuestoActual);
    if (!repuestoActual || !Number.isInteger(cantidad) || cantidad <= 0) {
      setItemError("La cantidad del repuesto debe ser un número entero mayor que cero.");
      return;
    }
    const repuesto = catalogs.repuestos.find((r) => String(r.id_repuesto) === String(repuestoActual));
    if (!repuesto) return;
    if (items.some((it) => it.id_repuesto === repuesto.id_repuesto)) return;
    if (cantidad > repuesto.stock) {
      setItemError(`Solo hay ${repuesto.stock} unidades de ${repuesto.nombre} disponibles.`);
      return;
    }
    setItemError("");

    const precioUnitario = Number(repuesto.precio_unitario);
    const subtotal = cantidad * precioUnitario;

    setFormData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        {
          id_detalle_venta: Date.now(),
          id_venta: Number(prev.id_venta || 1),
          id_repuesto: repuesto.id_repuesto,
          nombre: repuesto.nombre,
          cantidad,
          precio_unitario: precioUnitario,
          subtotal,
        },
      ],
    }));
    setRepuestoActual("");
    setCantidadRepuestoActual(1);
  };

  const handleAgregarServicio = () => {
    const cantidad = Number(cantidadServicioActual);
    if (!servicioActual || !Number.isInteger(cantidad) || cantidad <= 0) {
      setItemError("La cantidad del servicio debe ser un número entero mayor que cero.");
      return;
    }
    const servicio = serviciosDisponibles.find((item) => String(item.id) === String(servicioActual));
    if (!servicio || items.some((item) => item.id_servicio === servicio.id)) return;

    setItemError("");
    const precioUnitario = Number(servicio.precio || 0);
    setFormData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        {
          id_detalle_venta: Date.now(),
          id_venta: Number(prev.id_venta || 1),
          id_servicio: servicio.id,
          nombre: servicio.nombre,
          cantidad,
          precio_unitario: precioUnitario,
          subtotal: cantidad * precioUnitario,
          tipo: "servicio",
        },
      ],
    }));
    setServicioActual("");
    setCantidadServicioActual(1);
  };

  const handleQuitarItem = (item) => {
    setFormData((prev) => ({
      ...prev,
      items: (prev.items || []).filter((current) =>
        item.tipo === "servicio"
          ? current.id_servicio !== item.id_servicio
          : current.id_repuesto !== item.id_repuesto
      ),
    }));
  };

  return (
    <>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(15rem,0.7fr)_minmax(0,1.5fr)]">
      <div className="space-y-4">
        {catalogsLoading && <p role="status" className="text-sm text-muted-foreground">Cargando clientes, servicios, repuestos y métodos de pago...</p>}
        {catalogsError && (
          <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            No se pudieron cargar los catálogos: {catalogsError}
            <button type="button" onClick={loadCatalogs} className="ml-2 font-medium underline">Reintentar</button>
          </div>
        )}
        {itemError && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{itemError}</p>}
        {citasError && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">No se pudieron cargar las citas: {citasError}</p>}
        <div>
          <label htmlFor="fecha-venta" className="block text-sm font-medium mb-2">Fecha de Venta *</label>
          <input
            id="fecha-venta"
            type="date"
            value={formData.fecha_venta || ""}
            onChange={field("fecha_venta")}
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">¿Tiene cita?</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => handleTieneCitaChange(true)} aria-pressed={tieneCita} className={`flex-1 rounded-lg border px-4 py-2 ${tieneCita ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent"}`}>Sí</button>
            <button type="button" onClick={() => handleTieneCitaChange(false)} aria-pressed={!tieneCita} className={`flex-1 rounded-lg border px-4 py-2 ${!tieneCita ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent"}`}>No</button>
          </div>
        </div>
        {tieneCita && (
          <div>
            <label className="block text-sm font-medium mb-2">Cita *</label>
            <SearchableSelect value={formData.id_cita ?? ""} onChange={handleCitaChange} required className={inputCls}>
              <option value="">Seleccionar cita</option>
              {citasDisponibles.map((cita) => (
                <option key={cita.id} value={cita.id}>
                  Cita #{cita.id} · {getUsuarioNombre(cita.id_usuario, cita.nombre_cliente)} · {getVehiculoNombre(cita.id_vehiculo, cita.nombre_vehiculo)} · {cita.fecha_cita}
                </option>
              ))}
            </SearchableSelect>
          </div>
        )}
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-sm font-medium">Cliente *</label>
            <button
              type="button"
              onClick={openCustomerModal}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <UserRoundPlus className="h-4 w-4" />
              Registrar cliente
            </button>
          </div>
          <SearchableSelect value={formData.id_cliente} onChange={field("id_cliente")} required className={inputCls}>
            <option value="">Seleccionar cliente</option>
            {catalogs.clientes.map((cliente) => <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>)}
          </SearchableSelect>
        </div>
        {!tieneCita && (
          <>
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium">Vehículo *</label>
                <button
                  type="button"
                  onClick={openVehicleModal}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  <CarFront className="h-4 w-4" />
                  Registrar vehículo
                </button>
              </div>
              <SearchableSelect value={formData.cita_id_vehiculo ?? ""} onChange={(event) => setFormData((prev) => ({ ...prev, cita_id_vehiculo: event.target.value }))} required className={inputCls}>
                <option value="">Seleccionar vehículo</option>
                {catalogs.vehiculos.filter((vehiculo) => String(vehiculo.id_cliente) === String(formData.id_cliente)).map((vehiculo) => (
                  <option key={vehiculo.id} value={vehiculo.id}>{vehiculo.nombre}</option>
                ))}
              </SearchableSelect>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fecha de la cita *</label>
              <input type="date" value={formData.cita_fecha ?? ""} onChange={(event) => setFormData((prev) => ({ ...prev, cita_fecha: event.target.value }))} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hora de la cita *</label>
              <input type="time" value={formData.cita_hora ?? ""} onChange={(event) => setFormData((prev) => ({ ...prev, cita_hora: event.target.value }))} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Observaciones</label>
              <textarea value={formData.cita_observaciones ?? ""} onChange={(event) => setFormData((prev) => ({ ...prev, cita_observaciones: event.target.value }))} rows={3} className={`${inputCls} resize-none`} />
            </div>
          </>
        )}
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-sm font-medium">Método de Pago *</label>
            <button
              type="button"
              onClick={() => {
                setPaymentError("");
                setPaymentModalOpen(true);
              }}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <Plus className="h-4 w-4" />
              Registrar método
            </button>
          </div>
          <SearchableSelect value={formData.id_metodo_pago} onChange={field("id_metodo_pago")} required className={inputCls}>
            <option value="">Seleccionar método de pago</option>
            {catalogs.metodosPago.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </SearchableSelect>
          {!catalogsLoading && catalogs.metodosPago.length === 0 && (
            <p className="mt-1 text-sm text-warning">No hay métodos de pago registrados. Registra uno para continuar.</p>
          )}
        </div>
        <div><label className="block text-sm font-medium mb-2">Estado</label>
          <SearchableSelect value={formData.estado} onChange={field("estado")} searchable={false} className={inputCls}>
            <option value="pendiente">Pendiente</option>
            <option value="pagada">Pagada</option>
            <option value="credito">A Crédito</option>
            <option value="cancelada">Cancelada</option>
          </SearchableSelect>
        </div>
      </div>

      <div className="min-w-0 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold">Agregar conceptos</h3>
          <span className="text-xs text-muted-foreground">{items.length} concepto{items.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Servicio</label>
          <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
            <SearchableSelect
              value={servicioActual}
              onChange={(e) => setServicioActual(e.target.value)}
              className={`${inputCls} min-w-0`}
            >
              <option value="">Seleccionar servicio</option>
              {serviciosDisponibles
                .filter((servicio) => !items.some((item) => item.id_servicio === servicio.id))
                .map((servicio) => <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>)}
            </SearchableSelect>
            <input
              type="number"
              min={1}
              step="1"
              value={cantidadServicioActual}
              onChange={(e) => setCantidadServicioActual(e.target.value)}
              className={`${inputCls} w-24`}
              placeholder="Cant."
              aria-label="Cantidad de servicios"
            />
            <button
              type="button"
              onClick={handleAgregarServicio}
              disabled={!servicioActual}
              className="shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Agregar
            </button>
          </div>
        </div>
        <div className="mb-4 border-t border-border pt-4">
          <label className="block text-sm font-medium mb-2">Repuesto</label>
        <div className="mb-4 grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
          <SearchableSelect value={repuestoActual} onChange={(e) => setRepuestoActual(e.target.value)} className={`${inputCls} min-w-0`}>
            <option value="">Seleccionar repuesto</option>
            {catalogs.repuestos
              .filter((repuesto) => repuesto.stock > 0 && !items.some((item) => item.id_repuesto === repuesto.id_repuesto))
              .map((repuesto) => <option key={repuesto.id_repuesto} value={repuesto.id_repuesto}>{repuesto.nombre} · Stock: {repuesto.stock}</option>)}
          </SearchableSelect>
          <input
            type="number"
            min={1}
            step="1"
            value={cantidadRepuestoActual}
            onChange={(e) => setCantidadRepuestoActual(e.target.value)}
            className={`${inputCls} w-24`}
            placeholder="Cant."
            aria-label="Cantidad de repuestos"
          />
          <button
            type="button"
            onClick={handleAgregarItem}
            disabled={!repuestoActual}
            className="shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar
          </button>
        </div>
        </div>

        {items.length > 0 && (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-accent/50">
                <tr className="text-left">
                  <th className="px-3 py-2 font-medium">Concepto</th>
                  <th className="px-3 py-2 font-medium">Cantidad</th>
                  <th className="px-3 py-2 font-medium">Precio Unit.</th>
                  <th className="px-3 py-2 font-medium text-right">Subtotal</th>
                  <th className="px-3 py-2 font-medium text-right">Quitar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((it) => (
                  <tr key={`${it.id_detalle_venta}-${it.id_repuesto}`}>
                    <td className="px-3 py-2">{it.nombre}</td>
                    <td className="px-3 py-2">{it.cantidad}</td>
                    <td className="px-3 py-2">${Number(it.precio_unitario).toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">${Number(it.subtotal || 0).toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">
                      <button type="button" onClick={() => handleQuitarItem(it)} className="p-1 hover:bg-destructive/10 text-destructive rounded-md transition-colors" aria-label={`Quitar ${it.nombre}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-border bg-accent/30">
                <tr>
                  <td colSpan={3} className="px-3 py-2 text-right font-semibold">Total</td>
                  <td className="px-3 py-2 text-right font-semibold text-primary">${(totalItems + otherConceptsTotal).toFixed(2)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
        {otherConceptsTotal > 0 && (
          <p className="mt-3 text-right text-sm text-muted-foreground">
            Otros conceptos ya registrados: ${otherConceptsTotal.toFixed(2)}
          </p>
        )}
        {!items.length && otherConceptsTotal > 0 && (
          <p className="text-right text-sm font-semibold text-primary">Total: ${(totalItems + otherConceptsTotal).toFixed(2)}</p>
        )}
      </div>
    </div>
    {customerModalOpen && (
      <ModalWrapper title="Registrar cliente" onClose={() => setCustomerModalOpen(false)}>
        <form onSubmit={saveCustomer} className="space-y-4">
          {customerError && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{customerError}</p>}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Nombre *</label>
              <input required value={customerForm.nombre} onChange={(event) => setCustomerForm((current) => ({ ...current, nombre: event.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Apellido</label>
              <input value={customerForm.apellido} onChange={(event) => setCustomerForm((current) => ({ ...current, apellido: event.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Correo electrónico *</label>
              <input type="email" required value={customerForm.email} onChange={(event) => setCustomerForm((current) => ({ ...current, email: event.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Teléfono</label>
              <input type="tel" inputMode="numeric" maxLength={10} pattern="[0-9]{0,10}" value={customerForm.telefono} onChange={(event) => setCustomerForm((current) => ({ ...current, telefono: onlyDigits(event.target.value).slice(0, 10) }))} className={inputCls} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Tipo de documento</label>
              <select value={customerForm.tipo_documento} onChange={(event) => setCustomerForm((current) => ({ ...current, tipo_documento: event.target.value }))} className={inputCls}>
                <option value="CC">Cédula Ciudadanía</option>
                <option value="PA">Pasaporte</option>
                <option value="PPT">PPT</option>
                <option value="EX">Extranjero</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Número de documento</label>
              <input inputMode="numeric" maxLength={10} pattern="[0-9]{0,10}" value={customerForm.numero_documento} onChange={(event) => setCustomerForm((current) => ({ ...current, numero_documento: onlyDigits(event.target.value).slice(0, 10) }))} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Dirección</label>
              <input value={customerForm.direccion} onChange={(event) => setCustomerForm((current) => ({ ...current, direccion: event.target.value }))} className={inputCls} />
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button type="button" onClick={() => setCustomerModalOpen(false)} className="rounded-lg border border-border px-6 py-2 hover:bg-accent">Cancelar</button>
            <button type="submit" disabled={customerSaving} className="rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-secondary disabled:opacity-50">
              {customerSaving ? "Guardando..." : "Guardar cliente"}
            </button>
          </div>
        </form>
      </ModalWrapper>
    )}
    {paymentModalOpen && (
      <ModalWrapper title="Registrar método de pago" onClose={() => setPaymentModalOpen(false)}>
        <form onSubmit={savePaymentMethod} className="space-y-4">
          {paymentError && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{paymentError}</p>}
          <div>
            <label htmlFor="nuevo-metodo-pago" className="mb-2 block text-sm font-medium">Nombre del método *</label>
            <input
              id="nuevo-metodo-pago"
              autoFocus
              required
              value={paymentName}
              onChange={(event) => setPaymentName(event.target.value)}
              placeholder="Ej. Efectivo, Transferencia, Tarjeta"
              className={inputCls}
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button type="button" onClick={() => setPaymentModalOpen(false)} className="rounded-lg border border-border px-6 py-2 hover:bg-accent">Cancelar</button>
            <button type="submit" disabled={paymentSaving} className="rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-secondary disabled:opacity-50">
              {paymentSaving ? "Guardando..." : "Guardar método"}
            </button>
          </div>
        </form>
      </ModalWrapper>
    )}
    <VehiculoFormModal
      modal={vehicleAdmin.modal}
      form={vehicleAdmin.form}
      setForm={vehicleAdmin.setForm}
      onClose={vehicleAdmin.closeModal}
      onGuardar={saveVehicleAndSelect}
      usuarios={vehicleAdmin.usuarios}
      usuariosLoading={vehicleAdmin.usuariosLoading}
      usuariosError={vehicleAdmin.usuariosError}
      onRetryUsuarios={vehicleAdmin.loadUsuarios}
      tiposVehiculo={vehicleAdmin.tiposVehiculo}
      tiposVehiculoLoading={vehicleAdmin.tiposVehiculoLoading}
      tiposVehiculoError={vehicleAdmin.tiposError}
      onRetryTipos={vehicleAdmin.loadTiposVehiculo}
      saveError={vehicleAdmin.actionError}
    />
    </>
  );
}
