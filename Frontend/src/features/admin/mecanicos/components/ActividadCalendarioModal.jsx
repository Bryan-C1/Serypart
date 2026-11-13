import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, ChevronLeft, ChevronRight, ClipboardCheck } from "lucide-react";
import { ModalWrapper } from "./ModalWrapper";
import {
  createAsistenciaMecanico,
  deleteAsistenciaMecanico,
  getActividadMensual,
  updateAsistenciaMecanico,
} from "../services/mecanicosService";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 2,
});
const monthFormatter = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" });
const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

function getMonthStart(date) {
  return formatLocalDate(new Date(date.getFullYear(), date.getMonth(), 1, 12));
}

function getWorkHours(date) {
  return parseLocalDate(date).getDay() === 6
    ? { apertura: "08:00", cierre: "14:00" }
    : { apertura: "08:00", cierre: "17:00" };
}

function getCalendarCells(month) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1, 12);
  const blanks = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return [
    ...Array.from({ length: blanks }, (_, index) => ({ key: `blank-${index}` })),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(month.getFullYear(), month.getMonth(), index + 1, 12);
      return { key: formatLocalDate(date), date: formatLocalDate(date), day: index + 1 };
    }),
  ];
}

function formatMoney(value) {
  return currencyFormatter.format(Number(value));
}

function getTimeOptions(start, end, currentValue) {
  const startMinutes = Number(start.slice(0, 2)) * 60 + Number(start.slice(3, 5));
  const endMinutes = Number(end.slice(0, 2)) * 60 + Number(end.slice(3, 5));
  const minutes = [];
  for (let value = Math.ceil(startMinutes / 5) * 5; value <= endMinutes; value += 5) {
    minutes.push(value);
  }
  if (endMinutes % 5 !== 0) minutes.push(endMinutes);
  if (currentValue && /^\d{2}:\d{2}$/.test(currentValue)) {
    const currentMinutes = Number(currentValue.slice(0, 2)) * 60 + Number(currentValue.slice(3, 5));
    if (currentMinutes < startMinutes || currentMinutes > endMinutes) minutes.push(currentMinutes);
  }
  return [...new Set(minutes)]
    .sort((left, right) => left - right)
    .map((value) => `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`);
}

function TimePicker({ label, value, start, end, onChange }) {
  const options = getTimeOptions(start, end, value);
  const selectedHour = value?.slice(0, 2) || "";
  const selectedMinute = value?.slice(3, 5) || "";
  const hours = [...new Set(options.map((time) => time.slice(0, 2)))];
  const minutes = options
    .filter((time) => time.startsWith(`${selectedHour}:`))
    .map((time) => time.slice(3, 5));

  const handleHourChange = (event) => {
    const nextHour = event.target.value;
    const nextTime = options.find((time) => time.startsWith(`${nextHour}:`));
    if (nextTime) onChange(nextTime);
  };

  const handleMinuteChange = (event) => {
    onChange(`${selectedHour}:${event.target.value}`);
  };

  return (
    <div className="min-w-0 space-y-2 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-semibold tabular-nums text-primary">
          {value || "—"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="min-w-0 space-y-1 text-xs text-muted-foreground">
          Hora
          <select
            aria-label={`${label}, hora`}
            size={4}
            value={hours.includes(selectedHour) ? selectedHour : ""}
            onChange={handleHourChange}
            className="h-[4.5rem] w-full overflow-y-auto rounded-md border border-border bg-input-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {hours.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
          </select>
        </label>
        <label className="min-w-0 space-y-1 text-xs text-muted-foreground">
          Minutos
          <select
            aria-label={`${label}, minutos`}
            size={4}
            value={minutes.includes(selectedMinute) ? selectedMinute : ""}
            onChange={handleMinuteChange}
            className="h-[4.5rem] w-full overflow-y-auto rounded-md border border-border bg-input-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {minutes.map((minute) => <option key={minute} value={minute}>{minute}</option>)}
          </select>
        </label>
      </div>
    </div>
  );
}

function getDefaultDraft(date) {
  const { apertura, cierre } = getWorkHours(date);
  return {
    asistio: parseLocalDate(date).getDay() !== 0,
    hora_inicio: apertura,
    hora_fin: cierre,
  };
}

export function ActividadCalendarioModal({ mecanico, onClose }) {
  const [selectedDate, setSelectedDate] = useState(() => formatLocalDate(new Date()));
  const [displayMonth, setDisplayMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 12);
  });
  const [actividad, setActividad] = useState({
    asistencias: [],
    ventas: [],
    dias_con_ventas: [],
    total_liquidacion_dia: 0,
    total_liquidacion_mes: 0,
  });
  const [asistenciaDraft, setAsistenciaDraft] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [attendanceSaveError, setAttendanceSaveError] = useState("");
  const [attendanceSaveSuccess, setAttendanceSaveSuccess] = useState("");
  const monthStart = useMemo(() => getMonthStart(displayMonth), [displayMonth]);
  const calendarCells = useMemo(() => getCalendarCells(displayMonth), [displayMonth]);
  const asistenciasPorFecha = useMemo(
    () => new Map(actividad.asistencias.map((asistencia) => [asistencia.fecha, asistencia])),
    [actividad.asistencias],
  );
  const diasConVentas = useMemo(
    () => new Set(actividad.dias_con_ventas),
    [actividad.dias_con_ventas],
  );
  const selectedAttendance = asistenciasPorFecha.get(selectedDate);
  const savedDraft = asistenciaDraft[selectedDate];
  const selectedDraft = savedDraft
    ? {
      ...savedDraft,
      ...(selectedAttendance && savedDraft.asistio
        ? {
          hora_inicio: savedDraft.hora_inicio || selectedAttendance.hora_inicio,
          hora_fin: savedDraft.hora_fin || selectedAttendance.hora_fin,
        }
        : {}),
    }
    : (selectedAttendance
      ? {
        asistio: true,
        hora_inicio: selectedAttendance.hora_inicio,
        hora_fin: selectedAttendance.hora_fin,
      }
      : { asistio: false, hora_inicio: "", hora_fin: "" });
  const { apertura, cierre } = getWorkHours(selectedDate);
  const attendanceTimeError = selectedDraft.asistio
    && selectedDraft.hora_inicio
    && selectedDraft.hora_fin
    ? selectedDraft.hora_inicio < apertura || selectedDraft.hora_fin > cierre
      ? `El horario debe estar entre las ${apertura} y las ${cierre}.`
      : selectedDraft.hora_fin <= selectedDraft.hora_inicio
        ? "La hora de salida debe ser posterior a la hora de entrada."
        : ""
    : "";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getActividadMensual(mecanico.id, monthStart, selectedDate)
      .then((monthlyActivity) => {
        if (cancelled) return;
        setActividad(monthlyActivity);
        setAsistenciaDraft((current) => {
          const next = { ...current };
          monthlyActivity.asistencias.forEach((asistencia) => {
            next[asistencia.fecha] = {
              asistio: true,
              hora_inicio: asistencia.hora_inicio,
              hora_fin: asistencia.hora_fin,
            };
          });
          return next;
        });
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mecanico.id, monthStart, selectedDate]);

  const selectDate = (date) => {
    setAttendanceSaveError("");
    setAttendanceSaveSuccess("");
    setSelectedDate(date);
    setAsistenciaDraft((current) => {
      const existing = asistenciasPorFecha.get(date);
      if (current[date]?.asistio) return current;
      return {
        ...current,
        [date]: existing
          ? {
            asistio: true,
            hora_inicio: existing.hora_inicio,
            hora_fin: existing.hora_fin,
          }
          : getDefaultDraft(date),
      };
    });
  };

  const navigateMonth = (amount) => {
    const nextMonth = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth() + amount,
      1,
      12,
    );
    setDisplayMonth(nextMonth);
    selectDate(formatLocalDate(nextMonth));
  };

  const updateAttendanceDraft = (changes) => {
    setAttendanceSaveError("");
    setAttendanceSaveSuccess("");
    setAsistenciaDraft((current) => ({
      ...current,
      [selectedDate]: {
        ...selectedDraft,
        ...changes,
      },
    }));
  };

  const saveAttendance = async () => {
    if (saving) return;
    if (selectedDraft.asistio && (!selectedDraft.hora_inicio || !selectedDraft.hora_fin)) {
      setAttendanceSaveError("Selecciona la hora de entrada y salida antes de guardar.");
      return;
    }
    if (attendanceTimeError) {
      setAttendanceSaveError(attendanceTimeError);
      return;
    }
    setSaving(true);
    setAttendanceSaveError("");
    setAttendanceSaveSuccess("");
    let attendanceWasSaved = false;
    try {
      if (selectedDraft.asistio) {
        const attendance = {
          fecha: selectedDate,
          hora_inicio: selectedDraft.hora_inicio,
          hora_fin: selectedDraft.hora_fin,
        };
        if (selectedAttendance) {
          await updateAsistenciaMecanico(mecanico.id, selectedAttendance.id_asistencia, attendance);
        } else {
          await createAsistenciaMecanico(mecanico.id, attendance);
        }
      } else if (selectedAttendance) {
        await deleteAsistenciaMecanico(mecanico.id, selectedAttendance.id_asistencia);
      } else {
        return;
      }

      setAttendanceSaveSuccess(
        selectedDraft.asistio ? "La asistencia se guardó correctamente." : "La asistencia se eliminó correctamente.",
      );
      attendanceWasSaved = true;
      const updatedActivity = await getActividadMensual(mecanico.id, monthStart, selectedDate);
      setActividad(updatedActivity);
      setAsistenciaDraft((current) => ({
        ...current,
        [selectedDate]: selectedDraft.asistio
          ? { ...selectedDraft }
          : { ...selectedDraft, asistio: false },
      }));
    } catch (requestError) {
      setAttendanceSaveError(
        attendanceWasSaved
          ? `La asistencia se guardó, pero no se pudo actualizar la vista: ${requestError.message}`
          : requestError.message,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalWrapper
      title={`Checklist y liquidación · ${mecanico.nombre} ${mecanico.apellido || ""}`}
      onClose={onClose}
    >
      <div className="space-y-6">
        <section className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary/70">Resumen</p>
              <h3 className="mt-1 flex items-center gap-2 text-lg font-semibold">
                <CalendarDays className="h-5 w-5 text-primary" />
                Calendario de asistencia
              </h3>
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1 shadow-sm">
              <button
                type="button"
                onClick={() => navigateMonth(-1)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h4 className="min-w-36 text-center text-sm font-semibold capitalize text-foreground">
                {monthFormatter.format(displayMonth)}
              </h4>
              <button
                type="button"
                onClick={() => navigateMonth(1)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div key={day} className="py-2 text-center text-[0.68rem] font-semibold uppercase tracking-wide text-muted-foreground">
                {day}
              </div>
            ))}
            {calendarCells.map((cell) => {
              if (!cell.date) return <div key={cell.key} className="h-16 rounded-xl border border-dashed border-transparent" />;
              const isSelected = cell.date === selectedDate;
              const isToday = cell.date === formatLocalDate(new Date());
              const worked = asistenciasPorFecha.has(cell.date);
              const hasSales = diasConVentas.has(cell.date);
              const isSunday = parseLocalDate(cell.date).getDay() === 0;
              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => selectDate(cell.date)}
                  aria-pressed={isSelected}
                  aria-label={`${cell.date}${worked ? ", trabajó" : ""}${hasSales ? ", tiene ventas" : ""}`}
                  className={`relative min-h-16 rounded-xl border p-1.5 text-sm text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/20"
                      : worked
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
                        : "border-border bg-background"
                  } ${isToday ? "font-bold" : ""} ${isSunday ? "text-muted-foreground" : ""}`}
                >
                  <span className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    isSelected ? "bg-primary text-primary-foreground shadow-sm" : "bg-background text-foreground"
                  }`}>
                    {cell.day}
                  </span>
                  <span className="mt-1 flex min-h-3 items-center justify-center gap-1">
                    {worked && <Check className="h-3 w-3 stroke-[3] text-emerald-600" aria-label="Asistencia guardada" />}
                    {hasSales && <span className="h-2 w-2 rounded-full bg-emerald-500" title="Ventas asociadas a este mecánico" />}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <Check className="h-3 w-3 stroke-[3]" />
              Asistencia guardada
            </span>
            <span className="flex items-center gap-2 rounded-full bg-blue-50 px-2.5 py-1 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Tiene ventas asociadas
            </span>
          </div>
        </section>

        {error && <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        {loading ? (
          <div role="status" className="py-5 text-center text-muted-foreground">Cargando actividad del mes...</div>
        ) : (
          <>
            <section className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  <span className="capitalize">{dateFormatter.format(parseLocalDate(selectedDate))}</span>
                </h3>
                {selectedAttendance && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                    Guardada
                  </span>
                )}
              </div>
              {selectedAttendance && (
                <div role="status" className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-emerald-200 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800">
                  <Check className="h-4 w-4 shrink-0 stroke-[3]" />
                  <span className="font-semibold">Asistencia guardada</span>
                  <span>
                    · Entrada {selectedAttendance.hora_inicio} · Salida {selectedAttendance.hora_fin}
                  </span>
                </div>
              )}
              <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium shadow-sm">
                <input
                  type="checkbox"
                  checked={Boolean(selectedDraft.asistio)}
                  onChange={(event) => updateAttendanceDraft({ asistio: event.target.checked })}
                  disabled={parseLocalDate(selectedDate).getDay() === 0}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
                />
                Trabajó este día
              </label>
              {selectedDraft.asistio && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <TimePicker
                    label="Hora de entrada"
                    value={selectedDraft.hora_inicio}
                    start={apertura}
                    end={cierre}
                    onChange={(hora_inicio) => updateAttendanceDraft({ hora_inicio })}
                  />
                  <TimePicker
                    label="Hora de salida"
                    value={selectedDraft.hora_fin}
                    start={apertura}
                    end={cierre}
                    onChange={(hora_fin) => updateAttendanceDraft({ hora_fin })}
                  />
                </div>
              )}
              {attendanceTimeError && (
                <p role="alert" className="text-sm text-destructive">{attendanceTimeError}</p>
              )}
              {attendanceSaveError && (
                <p role="alert" className="text-sm text-destructive">{attendanceSaveError}</p>
              )}
              {attendanceSaveSuccess && (
                <p role="status" className="text-sm text-emerald-600">{attendanceSaveSuccess}</p>
              )}
              <button
                type="button"
                onClick={saveAttendance}
                disabled={saving
                  || (!selectedDraft.asistio && !selectedAttendance)}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Guardando..." : selectedDraft.asistio ? "Guardar asistencia" : "Quitar asistencia"}
              </button>
            </section>

            <section className="space-y-3">
              <h3 className="font-semibold">Ventas asociadas a este mecánico</h3>
              {actividad.ventas.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                  No hay ventas asociadas a las citas de este mecánico para esta fecha.
                </p>
              ) : (
                <div className="space-y-3">
                  {actividad.ventas.map((venta) => (
                    <article key={venta.id_venta} className="overflow-hidden rounded-xl border border-border bg-card">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 p-3">
                        <div>
                          <h4 className="font-semibold">Venta #{venta.id_venta}</h4>
                          <p className="text-xs text-muted-foreground">Fecha: {venta.fecha_venta}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs capitalize text-muted-foreground">{venta.estado}</p>
                          <p className="font-semibold">{formatMoney(venta.total)}</p>
                        </div>
                      </div>
                      {venta.conceptos.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="border-b border-border text-left">
                              <tr>
                                <th className="p-3 font-medium">Tipo</th>
                                <th className="p-3 font-medium">Concepto</th>
                                <th className="p-3 text-right font-medium">Cantidad</th>
                                <th className="p-3 text-right font-medium">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {venta.conceptos.map((concepto) => (
                                <tr key={concepto.id_detalle_venta}>
                                  <td className="p-3 capitalize">{concepto.tipo}</td>
                                  <td className="p-3">{concepto.nombre}</td>
                                  <td className="p-3 text-right">{concepto.cantidad}</td>
                                  <td className="p-3 text-right">{formatMoney(concepto.subtotal)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="p-3 text-sm text-muted-foreground">Esta venta no tiene conceptos detallados.</p>
                      )}
                    </article>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                La liquidación considera únicamente los servicios incluidos en ventas no canceladas de los días con asistencia; excluye los repuestos.
              </p>
              <div className="flex items-center justify-between rounded-lg bg-accent/60 p-4">
                <span className="font-medium">Liquidación del día</span>
                <strong>{formatMoney(actividad.total_liquidacion_dia)}</strong>
              </div>
            </section>
          </>
        )}

        <div className="flex justify-end border-t border-border pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-5 py-2 hover:bg-accent">
            Cerrar
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
