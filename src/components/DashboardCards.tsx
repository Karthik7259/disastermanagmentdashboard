import { TrendingUp, Users, AlertTriangle, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  status?: "safe" | "warning" | "critical" | "active";
}

const MetricCard = ({ title, value, icon, trend, status }: MetricCardProps) => {
  const statusClass = status
    ? {
        safe: "border-l-4 border-l-success",
        warning: "border-l-4 border-l-warning",
        critical: "border-l-4 border-l-destructive",
        active: "border-l-4 border-l-accent",
      }[status]
    : "";

  return (
    <Card className={`dashboard-card ${statusClass}`}>
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

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Active Hazards"
        value="7"
        icon={<AlertTriangle className="h-5 w-5" />}
        status="critical"
        trend="+2 from yesterday"
      />
      <MetricCard
        title="Reports Today"
        value="142"
        icon={<Send className="h-5 w-5" />}
        status="active"
        trend="+23% from yesterday"
      />
      <MetricCard
        title="Citizens at Risk"
        value="8,429"
        icon={<Users className="h-5 w-5" />}
        status="warning"
        trend="Estimated coastal population"
      />
      <MetricCard
        title="Advisories Sent"
        value="12"
        icon={<Send className="h-5 w-5" />}
        status="safe"
        trend="Last 24 hours"
      />
    </div>
  );
};

export default DashboardCards;