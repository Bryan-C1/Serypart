import { Calendar } from "lucide-react";
import { getUpcomingAppointmentsByPeriod } from "../services/dashboardData";

export function UpcomingAppointmentsCard({ appointments, range }) {
  const upcomingAppointments = getUpcomingAppointmentsByPeriod(appointments, range);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Próximas Citas del período</h3>
        <Calendar className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="space-y-3">
        {upcomingAppointments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay próximas citas en este período.</p>
        ) : upcomingAppointments.map((appointment) => (
          <div key={appointment.id_agendamiento ?? appointment.id} className="p-3 bg-accent rounded-lg">
            <p className="font-medium text-sm">{appointment.nombre_cliente || "Cliente"}</p>
            <p className="text-xs text-muted-foreground mt-1">{appointment.service}</p>
            <p className="text-xs text-primary mt-1">{appointment.dateLabel} · {appointment.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
