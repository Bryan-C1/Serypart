import { ArrowLeft, CalendarDays, Car, ChevronDown, ChevronUp, ClipboardList, CreditCard, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { findExampleRecord, getClientProfile, getEntityPath, getExampleClientProfile, getSearchRecord, getVisibleRecordFields } from "../services/globalSearchService";

const labels = {
  nombre: "Nombre",
  apellido: "Apellido",
  numero_documento: "Número de documento",
  tipo_documento: "Tipo de documento",
  fecha_registro: "Fecha de registro",
  email: "Correo",
  telefono: "Teléfono",
  direccion: "Dirección",
  estado: "Estado",
  rol: "Rol",
  placa: "Placa",
  marca: "Marca",
  modelo: "Modelo",
  anio: "Año",
  año: "Año",
  color: "Color",
  tipo_vehiculo: "Tipo de vehículo",
  id_vehiculo: "Vehículo",
  id_agendamiento: "Cita",
  fecha_cita: "Fecha de cita",
  hora_cita: "Hora",
  observaciones: "Observaciones",
  servicios: "Servicios",
  fecha_venta: "Fecha",
  total: "Total",
  metodo_pago: "Método de pago",
  fecha: "Fecha",
  descripcion: "Descripción",
  precio: "Precio",
  precio_unitario: "Precio unitario",
  stock: "Existencias",
  stock_minimo: "Stock mínimo",
  nombre_empresa: "Empresa",
  nombre_cliente: "Contacto",
  nit: "NIT",
  fecha_compra: "Fecha de compra",
  proveedor: "Proveedor",
  foto: "Imagen",
  imagen: "Imagen",
  duracion_estimada: "Duración estimada",
};

function displayValue(value) {
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

function DetailFields({ record }) {
  const fields = getVisibleRecordFields(record);
  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {fields.map(([key, value]) => (
        <div key={key} className="min-w-0 rounded-lg bg-background p-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{labels[key] || key.replaceAll("_", " ")}</dt>
          <dd className="mt-1 break-words text-sm font-medium">{displayValue(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function ClientProfile({ profile }) {
  const [expandedVehicle, setExpandedVehicle] = useState(null);
  const { cliente, vehiculos, citas, ventas, historialVehiculos } = profile;
  const fullName = `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim();
  const sections = [
    { title: "Vehículos", icon: Car, items: vehiculos, empty: "Este cliente todavía no tiene vehículos registrados.", render: (item) => `${item.placa || "Sin placa"} · ${[item.marca, item.modelo, item.anio || item.año, item.color].filter(Boolean).join(" · ")}` },
    { title: "Citas", icon: CalendarDays, items: citas, empty: "No hay citas registradas para este cliente.", render: (item) => `${item.fecha_cita || "Fecha pendiente"} ${item.hora_cita || ""} · ${item.servicios || "Servicio sin especificar"} · ${item.placa || ""} · ${item.estado || ""}` },
    { title: "Ventas", icon: CreditCard, items: ventas, empty: "Este cliente todavía no tiene ventas registradas.", render: (item) => `Venta #${item.id_venta} · ${item.fecha_venta || ""} · $${item.total ?? 0} · ${item.estado || ""}` },
    { title: "Historial de vehículos", icon: ClipboardList, items: historialVehiculos, empty: "No hay historial de mantenimiento disponible.", render: (item) => `${item.fecha || ""} · ${item.placa || ""} · ${item.descripcion || ""}` },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound className="h-6 w-6" /></span>
          <div>
            <h2 className="text-xl font-semibold">{fullName || "Cliente"}</h2>
            <p className="text-sm text-muted-foreground">{cliente.estado || "Sin estado"}</p>
          </div>
        </div>
        <DetailFields record={cliente} />
      </section>

      {sections.map(({ title, icon: Icon, items, empty, render }) => (
        <section key={title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold"><Icon className="h-5 w-5 text-primary" />{title}</h3>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">{items.length}</span>
          </div>
          {items.length ? (
            <ul className="space-y-2">
              {items.map((item, index) => {
                const vehicleId = item.id_vehiculo ?? item.id;
                const isExpanded = title === "Vehículos" && expandedVehicle === vehicleId;
                return (
                  <li key={vehicleId ?? item.id_venta ?? item.id_agendamiento ?? item.id_historial_vehiculos ?? index} className="rounded-lg bg-background p-3 text-sm">
                    <p className="font-medium">{render(item)}</p>
                    {title === "Vehículos" && (
                      <>
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() => setExpandedVehicle((current) => current === vehicleId ? null : vehicleId)}
                          className="mt-3 inline-flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                          {isExpanded ? "Ocultar detalles" : "Ver detalles"}
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        {isExpanded && (
                          <div className="mt-3 border-t border-border pt-3">
                            <VehicleDetails vehicle={item} />
                          </div>
                        )}
                      </>
                    )}
                    {item.items?.length > 0 && <p className="mt-2 text-xs text-muted-foreground">{item.items.map((line) => `${line.repuesto || "Artículo"} × ${line.cantidad}`).join(" · ")}</p>}
                  </li>
                );
              })}
            </ul>
          ) : <p className="rounded-lg bg-background p-4 text-sm text-muted-foreground">{empty}</p>}
        </section>
      ))}
    </div>
  );
}

function VehicleDetails({ vehicle }) {
  const details = [
    ["Placa", vehicle.placa],
    ["Marca", vehicle.marca],
    ["Modelo", vehicle.modelo],
    ["Año", vehicle.año ?? vehicle.anio],
    ["Color", vehicle.color],
    ["Tipo de vehículo", vehicle.tipo_vehiculo],
    ["Estado", vehicle.estado],
    ["Fecha de registro", vehicle.fecha_registro],
  ].filter(([, value]) => value !== null && value !== undefined && value !== "");

  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {details.map(([label, value]) => (
        <div key={label} className="rounded-lg border border-border bg-card p-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
          <dd className="mt-1 font-medium">{displayValue(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function SearchDetailPage() {
  const { type, id } = useParams();
  const location = useLocation();
  const [record, setRecord] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [ownerProfileError, setOwnerProfileError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const isExample = id.startsWith("demo-");
  const rawId = isExample ? id.slice("demo-".length) : id;

  useEffect(() => {
    let active = true;
    setRecord(null);
    setOwnerProfile(null);
    setOwnerProfileError("");
    setError("");
    setLoading(true);

    const load = async () => {
      try {
        let result;
        if (isExample) {
          result = type === "clientes"
            ? getExampleClientProfile(rawId)
            : findExampleRecord(type, rawId);
          if (!result) throw new Error("No se encontró el detalle del ejemplo.");
        } else {
          result = type === "clientes"
            ? await getClientProfile(rawId)
            : await getSearchRecord(type, rawId);
        }
        if (active) setRecord(result);
        if (type === "vehiculos") {
          const vehicle = result?.details || result;
          if (vehicle?.id_usuario) {
            try {
              const profile = isExample
                ? getExampleClientProfile(vehicle.id_usuario)
                : await getClientProfile(vehicle.id_usuario);
              if (active) {
                if (profile) setOwnerProfile(profile);
                else setOwnerProfileError("No se encontró la ficha del propietario de este vehículo.");
              }
            } catch (profileError) {
              if (active) setOwnerProfileError(profileError.message);
            }
          }
        }
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, [isExample, rawId, type]);

  const resultInfo = location.state?.record;
  const title = type === "clientes" && record?.cliente
    ? `${record.cliente.nombre || ""} ${record.cliente.apellido || ""}`.trim()
    : recordInfoTitle(type, record) || resultInfo?.title || "Detalle de búsqueda";

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <Link to={`/busqueda?q=${encodeURIComponent(resultInfo?.title || "")}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Volver a resultados
      </Link>
      <div>
        <p className="text-sm font-medium text-primary">{resultInfo?.label || typeLabel(type)}</p>
        <h1 className="text-3xl font-semibold">{title}</h1>
        {isExample && <p className="mt-1 text-sm text-muted-foreground">Registro de ejemplo para mostrar cómo se verá la ficha.</p>}
      </div>

      {loading ? (
        <p className="py-12 text-center text-muted-foreground">Cargando detalle...</p>
      ) : error ? (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">{error}</div>
      ) : type === "clientes" ? (
        <ClientProfile profile={record} />
      ) : type === "vehiculos" ? (
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Información del propietario</h2>
            <p className="text-sm text-muted-foreground">Datos y actividad relacionados con el cliente de este vehículo.</p>
          </div>
          {ownerProfileError && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{ownerProfileError}</p>}
          {ownerProfile && <ClientProfile profile={ownerProfile} />}
        </section>
      ) : (
        <>
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <DetailFields record={record?.details || record} />
            {record?.items?.length > 0 && (
              <div className="mt-6">
                <h2 className="mb-3 text-lg font-semibold">Artículos</h2>
                <ul className="space-y-2">
                  {record.items.map((item, index) => (
                    <li key={item.id_detalle_venta || item.id_detalle_compra || index} className="flex flex-wrap justify-between gap-2 rounded-lg bg-background p-3 text-sm">
                      <span className="font-medium">{item.repuesto || "Artículo"} × {item.cantidad}</span>
                      <span className="text-muted-foreground">${item.subtotal ?? item.precio_unitario ?? 0}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {record?.foto && <img src={record.foto} alt={title} className="mt-5 max-h-80 rounded-lg object-contain" />}
            {record?.imagen && !record?.foto && <img src={record.imagen} alt={title} className="mt-5 max-h-80 rounded-lg object-contain" />}
          </section>
        </>
      )}

      {!isExample && !loading && !error && type !== "clientes" && (
        <Link to={getEntityPath(type, rawId)} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">
          Abrir módulo de {typeLabel(type).toLowerCase()}
        </Link>
      )}
    </div>
  );
}

function recordInfoTitle(type, record) {
  const item = record?.details || record;
  if (!item) return "";
  if (type === "vehiculos") return item.placa;
  if (type === "servicios" || type === "repuestos") return item.nombre;
  if (type === "proveedores") return item.nombre_empresa;
  if (type === "citas") return `Cita #${item.id_agendamiento}`;
  if (type === "ventas") return `Venta #${item.id_venta}`;
  if (type === "compras") return `Compra #${item.id_compra}`;
  if (type === "mecanicos") return `${item.nombre || ""} ${item.apellido || ""}`.trim();
  return "";
}

function typeLabel(type) {
  return ({
    clientes: "Cliente",
    vehiculos: "Vehículo",
    servicios: "Servicio",
    citas: "Cita",
    ventas: "Venta",
    repuestos: "Repuesto",
    proveedores: "Proveedor",
    compras: "Compra",
    mecanicos: "Mecánico",
  })[type] || "Registro";
}
