import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  FileText, 
  Download, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  MapPin
} from "lucide-react";

const AlertSystem = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState("");

  const recipientGroups = [
    { value: "all", label: "All Agencies" },
    { value: "coastal-districts", label: "Coastal Districts" },
    { value: "police", label: "Coastal Police" },
    { value: "coast-guard", label: "Coast Guard" },
    { value: "ndma", label: "NDMA/SDMA" },
    { value: "media", label: "Media Outlets" },
  ];

  const recentAlerts = [
    {
      id: 1,
      title: "Tsunami Warning - Bay of Bengal",
      recipients: "All Agencies",
      status: "sent",
      time: "2 min ago",
      severity: "high"
    },
    {
      id: 2,
      title: "Storm Surge Advisory - West Coast",
      recipients: "Coastal Districts",
      status: "sending",
      time: "15 min ago",
      severity: "medium"
    },
    {
      id: 3,
      title: "Weather Update - Monsoon Pattern",
      recipients: "Coast Guard",
      status: "sent",
      time: "1 hr ago",
      severity: "low"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "sending":
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "low":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted/10 text-muted-foreground border-border";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Alert Generation */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Generate Advisory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Templates */}
          <div>
            <label className="dashboard-label mb-2 block">Quick Templates</label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setAlertMessage("TSUNAMI WARNING: High-magnitude earthquake detected. Immediate evacuation recommended for coastal areas within 5km of shoreline.")}
              >
                Tsunami Alert
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setAlertMessage("STORM SURGE ADVISORY: Severe weather conditions expected. Coastal communities advised to move to higher ground.")}
              >
                Storm Advisory
              </Button>
            </div>
          </div>

          {/* Message Content */}
          <div>
            <label className="dashboard-label mb-2 block">Alert Message</label>
            <Textarea
              placeholder="Enter advisory message..."
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {/* Recipients */}
          <div>
            <label className="dashboard-label mb-2 block">Recipients</label>
            <Select value={selectedRecipients} onValueChange={setSelectedRecipients}>
              <SelectTrigger>
                <Users className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select recipient groups..." />
              </SelectTrigger>
              <SelectContent>
                {recipientGroups.map((group) => (
                  <SelectItem key={group.value} value={group.value}>
                    {group.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Send Alert
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{alert.recipients}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(alert.status)}
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${
                    alert.status === "sent" ? "text-success" : 
                    alert.status === "sending" ? "text-warning" : 
                    "text-muted-foreground"
                  }`}>
                    {alert.status === "sent" ? "Successfully Sent" : 
                     alert.status === "sending" ? "Sending..." : 
                     "Pending"}
                  </span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-border">
            <Button variant="outline" className="w-full">
              View All Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertSystem;