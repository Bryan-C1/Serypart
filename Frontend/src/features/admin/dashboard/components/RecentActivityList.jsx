import { useNavigate } from "react-router-dom";
import { getRecentActivityByPeriod, getPeriodoLabel } from "../services/dashboardData";

export function RecentActivityList({ periodo }) {
  const navigate = useNavigate();
  const activities = getRecentActivityByPeriod(periodo);

  return (
    <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold">Actividad del período</h3>
        <p className="text-xs text-muted-foreground mt-1">{getPeriodoLabel(periodo)}</p>
      </div>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay actividad en este período.</p>
        ) : activities.map((activity) => {
          const activityContent = (
            <>
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === "completed" ? "bg-success" :
                  activity.status === "pending" ? "bg-warning" :
                  activity.status === "new" ? "bg-blue-500" : "bg-primary"
                }`}></div>
                <div>
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-sm text-muted-foreground">{activity.client}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{activity.month}</span>
            </>
          );
          const className = "flex items-center justify-between py-3 border-b border-border last:border-0";

          return activity.type === "Cita Programada" ? (
            <button
              key={activity.id}
              type="button"
              onClick={() => navigate(`/agendamiento?cita=${encodeURIComponent(activity.id)}`)}
              className={`${className} w-full rounded-lg text-left transition-colors hover:bg-accent/50`}
            >
              {activityContent}
            </button>
          ) : (
            <div key={activity.id} className={className}>
              {activityContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}
