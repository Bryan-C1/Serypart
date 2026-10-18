import { Calendar } from "lucide-react";
import { upcomingAppointments } from "../services/dashboardData";

export function UpcomingAppointmentsCard() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Próximas Citas</h3>
        <Calendar className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="space-y-3">
        {upcomingAppointments.map((appointment, index) => (
          <div key={index} className="p-3 bg-accent rounded-lg">
            <p className="font-medium text-sm">{appointment.client}</p>
            <p className="text-xs text-muted-foreground mt-1">{appointment.service}</p>
            <p className="text-xs text-primary mt-1">{appointment.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
