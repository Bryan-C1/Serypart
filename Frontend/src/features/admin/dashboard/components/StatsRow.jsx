import { TrendingUp, TrendingDown } from "lucide-react";
import { stats } from "../services/dashboardData";

export function StatsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;

        return (
          <div key={stat.name} className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-semibold mt-2">{stat.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                  <TrendIcon className="w-4 h-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
