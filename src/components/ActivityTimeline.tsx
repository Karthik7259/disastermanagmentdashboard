import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, Users, Radio, FileText } from "lucide-react";

interface TimelineItem {
  id: string;
  type: "alert" | "report" | "update" | "system";
  title: string;
  description: string;
  time: string;
  severity?: "high" | "medium" | "low";
}

const timelineData: TimelineItem[] = [
  {
    id: "1",
    type: "alert",
    title: "Tsunami Warning Issued",
    description: "High-magnitude earthquake detected in Bay of Bengal. Advisory sent to 12 districts.",
    time: "2 min ago",
    severity: "high"
  },
  {
    id: "2",
    type: "report",
    title: "Citizen Report - Chennai",
    description: "Unusual wave patterns reported by fishing community near Marina Beach.",
    time: "8 min ago",
    severity: "medium"
  },
  {
    id: "3",
    type: "update",
    title: "Model Update",
    description: "INCOIS storm surge model updated with latest satellite data.",
    time: "15 min ago"
  },
  {
    id: "4",
    type: "system",
    title: "Coast Guard Notified",
    description: "Alert successfully transmitted to all Coast Guard stations on East Coast.",
    time: "23 min ago"
  },
  {
    id: "5",
    type: "report",
    title: "Social Media Analysis",
    description: "Increased mentions of 'rough seas' detected across social platforms.",
    time: "35 min ago",
    severity: "low"
  },
  {
    id: "6",
    type: "update",
    title: "Weather Station Data",
    description: "Automated data sync completed for 45 coastal monitoring stations.",
    time: "1 hr ago"
  }
];

const getIcon = (type: string) => {
  switch (type) {
    case "alert":
      return <AlertTriangle className="h-4 w-4" />;
    case "report":
      return <Users className="h-4 w-4" />;
    case "update":
      return <FileText className="h-4 w-4" />;
    case "system":
      return <Radio className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getSeverityBadge = (severity?: string) => {
  if (!severity) return null;
  
  const variants = {
    high: "destructive" as const,
    medium: "secondary" as const,
    low: "outline" as const
  };
  
  return <Badge variant={variants[severity as keyof typeof variants]}>{severity}</Badge>;
};

const ActivityTimeline = () => {
  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineData.map((item, index) => (
            <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0">
              {/* Timeline icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                item.type === "alert" ? "bg-destructive/10 text-destructive" :
                item.type === "report" ? "bg-accent/10 text-accent" :
                item.type === "update" ? "bg-primary/10 text-primary" :
                "bg-muted text-muted-foreground"
              }`}>
                {getIcon(item.type)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      {getSeverityBadge(item.severity)}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View all button */}
        <div className="mt-4 pt-4 border-t border-border">
          <button className="text-sm text-primary hover:text-primary-hover font-medium">
            View all activity →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;