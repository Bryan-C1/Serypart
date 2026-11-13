import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Clock,
  Droplet,
  Gauge,
  ImagePlus,
  Plus,
  Wrench,
  X,
} from "lucide-react";
import { ImageWithFallback } from "../../../../shared/figma/ImageWithFallback";
import { getTipoVehiculoNombre } from "../services/serviciosData";
import { CITAS_UPDATED_EVENT, getCitasGuardadas } from "../../agendamiento/services/agendamientoData";
import { getCitas } from "../../agendamiento/services/agendamientoService";

const formatPrice = (price) => Number(price || 0).toLocaleString("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function getServiceIcon(name) {
  const normalizedName = name.toLocaleLowerCase();
  if (normalizedName.includes("aceite") || normalizedName.includes("filtro")) return Droplet;
  if (normalizedName.includes("revisión") || normalizedName.includes("diagnóstico")) return Gauge;
  if (normalizedName.includes("rueda") || normalizedName.includes("llanta")) return CircleDot;
  return Wrench;
}

function ServiceTreeNode({ servicio, servicios, onVer, onAgregarSubservicio, initiallyExpanded = false }) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const children = servicios
    .filter((item) => Number(item.id_servicio_padre) === Number(servicio.id))
    .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), undefined, { numeric: true }));
  const level = servicio.codigo?.split(".").length || 1;
  const Icon = getServiceIcon(servicio.nombre);

  return (
    <li className="min-w-0">
      <div className="flex items-center gap-3 px-3 py-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <button
          type="button"
          onClick={() => onVer(servicio)}
          className="min-w-0 flex-1 text-left"
          title={`Ver detalle de ${servicio.nombre}`}
        >
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate text-sm font-semibold">{servicio.nombre}</span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              {servicio.codigo}
            </span>
          </span>
          <span className="block text-xs text-muted-foreground">
            {servicio.duracion_estimada || "Duración no definida"}
            {children.length > 0 ? ` · ${children.length} opciones` : ""}
          </span>
        </button>
        <span className="shrink-0 text-sm font-semibold">{formatPrice(servicio.precio)}</span>
        {children.length > 0 ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-label={expanded ? `Contraer ${servicio.nombre}` : `Expandir ${servicio.nombre}`}
            aria-expanded={expanded}
            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            {expanded
              ? <ChevronDown className="h-4 w-4" />
              : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <span className="w-6 shrink-0" />
        )}
      </div>

      {expanded && children.length > 0 && (
        <div className="ml-8 border-l border-primary/50 pl-2">
          <ul className="divide-y divide-border/70">
            {children.map((child) => (
              <ServiceTreeNode
                key={child.id}
                servicio={child}
                servicios={servicios}
                onVer={onVer}
                onAgregarSubservicio={onAgregarSubservicio}
              />
            ))}
          </ul>
          <div className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
            <span className="text-muted-foreground">
              Nivel {level} de 3 · {children.length}/3 subservicios
            </span>
            {level < 3 && servicio.estado !== "anulado" && (
              <button
                type="button"
                onClick={() => onAgregarSubservicio(servicio)}
                disabled={children.length >= 3}
                className="inline-flex shrink-0 items-center gap-1 font-medium text-primary hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" />
                {children.length >= 3 ? "Máximo alcanzado" : "Agregar"}
              </button>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export function ServicioDetailModal({
  open,
  servicio,
  servicios,
  onClose,
  onBack,
  canGoBack,
  onVer,
  onEditar,
  onAgregarSubservicio,
}) {
  const [citas, setCitas] = useState(() => getCitasGuardadas());
  const [citasError, setCitasError] = useState("");

  useEffect(() => {
    let active = true;
    const actualizarCitas = () => setCitas(getCitasGuardadas());
    getCitas()
      .then((records) => {
        if (active) setCitas(records);
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

  if (!open || !servicio) return null;

  const citasDelServicio = citas.filter((cita) => (
    cita.servicios?.length
      ? cita.servicios.some((item) => Number(item.id) === Number(servicio.id))
      : Number(cita.id_servicio) === Number(servicio.id)
  ));
  const citasRealizadas = citasDelServicio.filter((cita) => ["completada", "entregada"].includes(cita.estado)).length;
  const nivel = servicio.codigo?.split(".").length || 1;
  const subservicios = servicios
    .filter((item) => Number(item.id_servicio_padre) === Number(servicio.id))
    .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), undefined, { numeric: true }));
  const ServicioIcon = getServiceIcon(servicio.nombre);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="servicio-detail-title"
        className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={!canGoBack}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </button>
            <h2 id="servicio-detail-title" className="truncate text-lg font-semibold">Detalles del Servicio</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalles"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className={`grid min-h-0 flex-1 gap-6 overflow-y-auto p-5 ${
          nivel >= 3 ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(17rem,0.8fr)_minmax(0,1.2fr)]"
        }`}>
          <div className="space-y-5">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-dashed border-border bg-accent/30">
              {servicio.imagen ? (
                <ImageWithFallback
                  src={servicio.imagen}
                  alt={servicio.nombre}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-primary/80">
                  <ServicioIcon className="h-14 w-14" strokeWidth={1.5} />
                </div>
              )}
              <span className="absolute bottom-3 left-3 rounded bg-background/80 px-2 py-1 text-[11px] text-muted-foreground">
                Imagen del servicio · 16:9
              </span>
              <button
                type="button"
                onClick={() => onEditar(servicio)}
                className="absolute bottom-2 right-2 inline-flex items-center gap-2 rounded-lg border border-border bg-card/95 px-3 py-2 text-xs font-medium shadow-sm hover:bg-accent"
              >
                <ImagePlus className="h-4 w-4" />
                Cambiar imagen
              </button>
            </div>

            <div className="border-b border-border pb-4">
              <h3 className="flex flex-wrap items-center gap-2 text-2xl font-semibold">
                {servicio.nombre}
                <span className="rounded bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                  {servicio.codigo}
                </span>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {servicio.descripcion || "Sin descripción"}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-x-5 gap-y-4">
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Tipo de vehículo</dt>
                <dd className="mt-1 text-sm font-semibold">{getTipoVehiculoNombre(servicio.id_tipo_vehiculo)}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Estado</dt>
                <dd className="mt-1">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    servicio.estado === "activo"
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {servicio.estado === "anulado" ? "Anulado" : servicio.estado === "activo" ? "Activo" : "Inactivo"}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Duración estimada</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {servicio.duracion_estimada || "No definida"}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Precio</dt>
                <dd className="mt-1 text-xl font-bold text-primary">{formatPrice(servicio.precio)}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Citas pedidas</dt>
                <dd className="mt-1 text-sm font-semibold">{citasDelServicio.length}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Citas realizadas</dt>
                <dd className="mt-1 text-sm font-semibold">{citasRealizadas}</dd>
              </div>
            </dl>
            {citasError && (
              <p role="alert" className="text-xs text-destructive">
                No se pudieron cargar las citas: {citasError}
              </p>
            )}
          </div>

          {nivel >= 3 ? (
            <section className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Wrench className="h-4 w-4" />
              </span>
              <div>
                <h4 className="text-sm font-semibold">Nivel final · 3 de 3</h4>
                <p className="text-xs text-muted-foreground">Este servicio ya no admite más subservicios.</p>
              </div>
            </section>
          ) : (
            <section className="flex min-h-[18rem] flex-col overflow-hidden rounded-xl border border-border">
              <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-4">
                <div>
                  <h4 className="font-semibold">Subservicios</h4>
                  <p className="text-xs text-muted-foreground">
                    Nivel {nivel} de 3 · {subservicios.length}/3 subservicios
                  </p>
                  <div className="mt-2 flex gap-1" aria-hidden="true">
                    {[1, 2, 3].map((step) => (
                      <span
                        key={step}
                        className={`h-1 w-8 rounded-full ${step <= nivel ? "bg-primary" : "bg-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                {servicio.estado !== "anulado" && (
                  <button
                    type="button"
                    onClick={() => onAgregarSubservicio(servicio)}
                    disabled={subservicios.length >= 3}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary/15 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {subservicios.length >= 3 ? "Máximo alcanzado" : "Agregar subservicio"}
                  </button>
                )}
              </div>
              {subservicios.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
                  <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium">Aún no hay subservicios</p>
                  <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                    Agrega hasta tres opciones para organizar este servicio por niveles.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {subservicios.map((item, index) => (
                    <ServiceTreeNode
                      key={item.id}
                      servicio={item}
                      servicios={servicios}
                      onVer={onVer}
                      onAgregarSubservicio={onAgregarSubservicio}
                      initiallyExpanded={index === 0}
                    />
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>

        <footer className="flex shrink-0 justify-end gap-3 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => onEditar(servicio)}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
          >
            Editar Servicio
          </button>
        </footer>
      </section>
    </div>
  );
}
