import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getFechaLocalActual, getUsuarioNombre } from "../services/agendamientoData";

export function MonthCalendarCard({ days, blanks, currentDate, monthLabel, citas, onPreviousMonth, onNextMonth, onTodayClick, onDayClick, onDayWithCitas, onCitaClick }) {
  const menuRef = useRef(null);
  const [menuDay, setMenuDay] = useState(null);

  useEffect(() => {
    const closeMenuOutside = (event) => {
      if (menuDay && !menuRef.current?.contains(event.target)) setMenuDay(null);
    };
    document.addEventListener("mousedown", closeMenuOutside);
    return () => document.removeEventListener("mousedown", closeMenuOutside);
  }, [menuDay]);

  const handleDayClick = (day, dayCitas) => {
    if (dayCitas.length === 0) {
      onDayClick(day);
      return;
    }
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onDayWithCitas?.(dateStr);
    setMenuDay((current) => (current?.day === day ? null : { day, citas: dayCitas }));
  };

  return (
    <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold capitalize">{monthLabel}</h2>
        <div className="flex gap-2">
          <button type="button" onClick={onTodayClick} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors" aria-label="Volver al día actual">
            Hoy
          </button>
          <button type="button" onClick={onPreviousMonth} className="p-2 hover:bg-accent rounded-lg transition-colors" aria-label="Mes anterior">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button type="button" onClick={onNextMonth} className="p-2 hover:bg-accent rounded-lg transition-colors" aria-label="Mes siguiente">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
        {blanks.map((blank) => (
          <div key={`blank-${blank}`} className="aspect-square"></div>
        ))}
        {days.map((day) => {
          const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayCitas = citas.filter((c) => c.fecha_cita === dateStr);
          const isToday = dateStr === getFechaLocalActual();

          return (
            <div
              key={day}
              onClick={() => handleDayClick(day, dayCitas)}
              className={`relative min-h-28 p-2 border rounded-lg hover:bg-accent cursor-pointer transition-colors ${
                isToday ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>
                {day}
              </div>
              {dayCitas.length > 0 && (
                <div className="flex flex-col gap-1">
                  {dayCitas.map((cita) => (
                    <button
                      key={cita.id}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onCitaClick(cita);
                      }}
                      className="block w-full text-left text-xs bg-primary/20 text-primary px-1 py-0.5 rounded truncate hover:bg-primary/30"
                      title={`Ver cita de ${getUsuarioNombre(cita.id_usuario, cita.nombre_cliente)}`}
                    >
                      {cita.hora_cita} · {getUsuarioNombre(cita.id_usuario, cita.nombre_cliente)}
                    </button>
                  ))}
                </div>
              )}
              {menuDay?.day === day && (
                <div
                  ref={menuRef}
                  className="absolute left-1 top-8 z-30 w-44 rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg"
                  onClick={(event) => event.stopPropagation()}
                >
                  <p className="px-2 pb-1 text-xs font-semibold text-muted-foreground">Citas del día</p>
                  <div className="space-y-1">
                    {menuDay.citas.map((cita) => (
                      <button
                        key={cita.id}
                        type="button"
                        onClick={() => {
                          setMenuDay(null);
                          onCitaClick(cita);
                        }}
                        className="block w-full truncate rounded px-2 py-1 text-left text-xs hover:bg-accent"
                      >
                        {cita.hora_cita} · {getUsuarioNombre(cita.id_usuario, cita.nombre_cliente)}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuDay(null);
                      onDayClick(day);
                    }}
                    className="mt-1 w-full rounded border-t border-border px-2 pt-2 text-left text-xs font-medium text-primary hover:text-secondary"
                  >
                    + Nueva cita
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
