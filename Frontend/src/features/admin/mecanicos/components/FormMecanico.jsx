import { useMemo, useState } from "react";
import { onlyDigits, onlyLetters, onlyPhone } from "../../../../shared/utils/inputValidation";
import { DIAS_SEMANA, HORARIOS_POR_DIA, especialidades, formatHorariosPorDia, getHorariosOcupadosPorDia, normalizeHorariosPorDia } from "../services/mecanicosData";
import { SearchableSelect } from "../../../../shared/ui/searchable-select";

export function FormMecanico({ formData, setFormData }) {
  const field = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: key === "nombre" || key === "apellido" ? onlyLetters(e.target.value) : key === "numeroDocumento" ? onlyDigits(e.target.value) : key === "telefono" ? onlyPhone(e.target.value) : e.target.value }));

  const inputCls = "w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring";
  const horariosPorDia = useMemo(() => normalizeHorariosPorDia(formData.horariosPorDia ?? formData.horarioDisponibilidad), [formData.horariosPorDia, formData.horarioDisponibilidad]);
  const [selectedDays, setSelectedDays] = useState(() => new Set(Object.keys(horariosPorDia)));

  const occupiedByOthers = getHorariosOcupadosPorDia(formData.mecanicos ?? [], formData.id ?? null);
  const selectedDaysInOrder = DIAS_SEMANA.filter((day) => selectedDays.has(day));
  const daySlots = HORARIOS_POR_DIA[DIAS_SEMANA[0]] || [];

  const addSlotToSelectedDays = (slotValue) => {
    setFormData((prev) => {
      const nextMap = normalizeHorariosPorDia(prev.horariosPorDia ?? prev.horarioDisponibilidad);
      const availableDays = selectedDaysInOrder.filter((day) =>
        !occupiedByOthers[day]?.has(slotValue) && !(nextMap[day] || []).includes(slotValue)
      );
      if (availableDays.length === 0) return prev;

      const updated = { ...nextMap };
      availableDays.forEach((day) => {
        updated[day] = [...(updated[day] || []), slotValue];
      });

      return {
        ...prev,
        horariosPorDia: updated,
        horarioDisponibilidad: formatHorariosPorDia(updated),
      };
    });
  };

  const toggleDaySelection = (day) => {
    const isSelected = selectedDays.has(day);
    setSelectedDays((prev) => {
      const updated = new Set(prev);
      if (updated.has(day)) updated.delete(day);
      else updated.add(day);
      return updated;
    });

    if (isSelected) {
      setFormData((prev) => {
        const updated = normalizeHorariosPorDia(prev.horariosPorDia ?? prev.horarioDisponibilidad);
        delete updated[day];
        return {
          ...prev,
          horariosPorDia: updated,
          horarioDisponibilidad: formatHorariosPorDia(updated),
        };
      });
    }
  };

  const removeSlotFromDay = (day, slotValue) => {
    setFormData((prev) => {
      const nextMap = normalizeHorariosPorDia(prev.horariosPorDia ?? prev.horarioDisponibilidad);
      const nextDaySlots = (nextMap[day] || []).filter((slot) => slot !== slotValue);

      const updated = { ...nextMap, [day]: nextDaySlots };
      if (nextDaySlots.length === 0) delete updated[day];

      return {
        ...prev,
        horariosPorDia: updated,
        horarioDisponibilidad: formatHorariosPorDia(updated),
      };
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tipo de Documento</label>
          <SearchableSelect value={formData.tipoDocumento} onChange={field("tipoDocumento")} className={inputCls}>
            <option value="CC">CC</option>
            <option value="CE">CE</option>
            <option value="NIT">NIT</option>
            <option value="Pasaporte">Pasaporte</option>
          </SearchableSelect>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Número de Documento</label>
          <input type="text" inputMode="numeric" value={formData.numeroDocumento} onChange={field("numeroDocumento")} pattern="[0-9]+" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Nombre *</label>
          <input type="text" value={formData.nombre} onChange={field("nombre")} pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+" required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Apellido</label>
          <input type="text" value={formData.apellido} onChange={field("apellido")} pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Teléfono</label>
          <input type="tel" inputMode="tel" value={formData.telefono} onChange={field("telefono")} pattern="[0-9+()\s-]+" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Dirección</label>
          <input type="text" value={formData.direccion} onChange={field("direccion")} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input type="email" value={formData.email} onChange={field("email")} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Especialidad</label>
          <SearchableSelect value={formData.especialidad} onChange={field("especialidad")} className={inputCls}>
            {especialidades.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </SearchableSelect>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Horario de disponibilidad</label>
          <div className="space-y-3 rounded-lg border border-border bg-background p-3">
            <div>
              <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-2">Días</label>
              <div className="grid grid-cols-2 gap-2">
                {DIAS_SEMANA.map((day) => {
                  const checked = selectedDays.has(day);

                  return (
                    <label
                      key={day}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${checked ? "border-primary bg-primary/5" : "border-border bg-input-background"}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleDaySelection(day)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
                      />
                      <span>{day}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-2">Horario del día</label>
              <select
                value=""
                onChange={(event) => {
                  const slotValue = event.target.value;
                  if (!slotValue) return;
                  addSlotToSelectedDays(slotValue);
                  event.target.value = "";
                }}
                className={inputCls}
                disabled={selectedDaysInOrder.length === 0}
              >
                <option value="">{selectedDaysInOrder.length ? "Selecciona un horario" : "Selecciona uno o varios días"}</option>
                {daySlots.map((option) => {
                  const availableDays = selectedDaysInOrder.filter((day) =>
                    !occupiedByOthers[day]?.has(option.value) && !(horariosPorDia[day] || []).includes(option.value)
                  );
                  const unavailableInSomeDays = availableDays.length > 0 && availableDays.length < selectedDaysInOrder.length;
                  const unavailableInAllDays = selectedDaysInOrder.length > 0 && availableDays.length === 0;
                  return (
                    <option key={option.value} value={option.value} disabled={unavailableInAllDays || selectedDaysInOrder.length === 0}>
                      {option.label}
                      {unavailableInAllDays ? " - No disponible" : unavailableInSomeDays ? " - Disponible en algunos días" : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Resumen</p>
              {Object.keys(horariosPorDia).length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay horarios seleccionados.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(horariosPorDia).map(([day, slots]) => (
                    <div key={day} className="rounded-lg border border-border bg-input-background p-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm">{day}</span>
                      </div>
                      <div className="mt-2 space-y-2">
                        {(slots || []).map((slot) => (
                          <div
                            key={`${day}-${slot}`}
                            className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-2.5 py-2 text-xs hover:bg-accent transition-colors"
                          >
                            <span>{HORARIOS_POR_DIA[day].find((option) => option.value === slot)?.label || slot}</span>
                            <button
                              type="button"
                              onClick={() => removeSlotFromDay(day, slot)}
                              className="rounded-md px-2 py-1 text-[11px] font-medium leading-4 text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              Quitar
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Estado</label>
          <SearchableSelect value={formData.estado} onChange={field("estado")} searchable={false} className={inputCls}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="vacaciones">Vacaciones</option>
            {formData.estado === "anulado" && <option value="anulado" disabled>Anulado</option>}
          </SearchableSelect>
        </div>
      </div>
    </div>
  );
}
