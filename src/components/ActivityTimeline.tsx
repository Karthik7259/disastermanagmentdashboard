import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, Users, Radio, FileText, Filter } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";

interface TimelineItem {
  id: string;
  type: "alert" | "report" | "update" | "system" | "hazard";
  title: string;
  description: string;
  time: string;
  severity?: "high" | "medium" | "low";
  location?: string;
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
  const { hazards, reports, alerts } = useDashboardData();
  const [filter, setFilter] = useState<string>("all");
  
  // Generate timeline from real data
  const generateTimeline = (): TimelineItem[] => {
    const items: TimelineItem[] = [];
    
    // Add recent hazards
    hazards.slice(0, 3).forEach(hazard => {
      items.push({
        id: `hazard-${hazard.id}`,
        type: "hazard",
        title: `${hazard.type.charAt(0).toUpperCase() + hazard.type.slice(1)} Alert`,
        description: hazard.description,
        time: getRelativeTime(hazard.reportedAt),
        severity: hazard.severity as any,
        location: hazard.location
      });
    });
    
    // Add recent reports
    reports.slice(0, 4).forEach(report => {
      items.push({
        id: `report-${report.id}`,
        type: "report",
        title: `Citizen Report - ${report.location}`,
        description: report.content,
        time: getRelativeTime(report.reportedAt),
        severity: report.severity as any,
        location: report.location
      });
    });
    
    // Add recent alerts
    alerts.slice(0, 2).forEach(alert => {
      items.push({
        id: `alert-${alert.id}`,
        type: "alert",
        title: alert.title,
        description: `Alert sent to ${alert.recipientCount} recipients`,
        time: getRelativeTime(alert.sentAt),
        severity: alert.severity as any
      });
    });
    
    // Add system updates
    items.push({
      id: "system-1",
      type: "system",
      title: "System Status Update",
      description: "All monitoring stations online and functioning normally",
      time: "5 min ago"
    });
    
    // Sort by time (newest first) and take top 8
    return items
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 8);
  };
  
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    return date.toLocaleDateString();
  };
  
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  
  useEffect(() => {
    setTimelineData(generateTimeline());
  }, [hazards, reports, alerts]);
  
  const filteredData = filter === "all" 
    ? timelineData 
    : timelineData.filter(item => item.type === filter);
  return (
    <Card className="dashboard-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "hazard" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("hazard")}
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Hazards
            </Button>
            <Button
              variant={filter === "report" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("report")}
            >
              <Users className="h-3 w-3 mr-1" />
              Reports
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredData.map((item, index) => (
            <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0">
              {/* Timeline icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                item.type === "hazard" ? "bg-destructive/10 text-destructive" :
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
                    {item.location && (
                      <div className="text-xs text-muted-foreground mb-1">📍 {item.location}</div>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                </div>
              </div>
            </div>
          ))}
          
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">No activity found</div>
              <div className="text-xs">Try adjusting the filter</div>
            </div>
          )}
        </div>
        
        {/* View all button */}
        <div className="mt-4 pt-4 border-t border-border">
          <button className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
            View all activity →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;