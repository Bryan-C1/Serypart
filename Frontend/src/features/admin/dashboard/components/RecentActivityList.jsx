import { recentActivity } from "../services/dashboardData";

export function RecentActivityList() {
  return (
    <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6 shadow-sm">
      <h3 className="font-semibold mb-4">Actividad Reciente</h3>
      <div className="space-y-4">
        {recentActivity.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
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
            <span className="text-sm text-muted-foreground">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
