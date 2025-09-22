import { TrendingUp, Users, AlertTriangle, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardData } from "@/hooks/useDashboardData";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  status?: "safe" | "warning" | "critical" | "active";
  onClick?: () => void;
}

const MetricCard = ({ title, value, icon, trend, status, onClick }: MetricCardProps) => {
  const statusClass = status
    ? {
        safe: "border-l-4 border-l-success",
        warning: "border-l-4 border-l-warning",
        critical: "border-l-4 border-l-destructive",
        active: "border-l-4 border-l-accent",
      }[status]
    : "";

  return (
    <Card 
      className={`dashboard-card ${statusClass} ${onClick ? 'cursor-pointer hover:shadow-lg transition-all duration-200' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="dashboard-label">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="dashboard-metric">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardCardsProps {
  onCardClick?: (cardType: string) => void;
}

const DashboardCards = ({ onCardClick }: DashboardCardsProps) => {
  const { stats } = useDashboardData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Active Hazards"
        value={stats.activeHazards.toString()}
        icon={<AlertTriangle className="h-5 w-5" />}
        status={stats.activeHazards > 5 ? "critical" : stats.activeHazards > 2 ? "warning" : "safe"}
        trend={`+${Math.floor(Math.random() * 3)} from yesterday`}
        onClick={() => onCardClick?.("hazards")}
      />
      <MetricCard
        title="Reports Today"
        value={stats.reportsToday.toString()}
        icon={<Send className="h-5 w-5" />}
        status="active"
        trend="+23% from yesterday"
        onClick={() => onCardClick?.("reports")}
      />
      <MetricCard
        title="Citizens at Risk"
        value={stats.citizensAtRisk.toLocaleString()}
        icon={<Users className="h-5 w-5" />}
        status={stats.citizensAtRisk > 100000 ? "critical" : stats.citizensAtRisk > 50000 ? "warning" : "safe"}
        trend="Estimated coastal population"
        onClick={() => onCardClick?.("population")}
      />
      <MetricCard
        title="Advisories Sent"
        value={stats.alertsSent.toString()}
        icon={<Send className="h-5 w-5" />}
        status="safe"
        trend="Last 24 hours"
        onClick={() => onCardClick?.("alerts")}
      />
    </div>
  );
};

export default DashboardCards;