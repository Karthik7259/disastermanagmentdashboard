import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { 
  Send, 
  FileText, 
  Download, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  MapPin,
  Loader2
} from "lucide-react";
import { useDashboardData, AlertData } from "@/hooks/useDashboardData";

const AlertSystem = () => {
  const { alerts, sendAlert, hazards } = useDashboardData();
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [isSending, setIsSending] = useState(false);

  const recipientGroups = [
    { value: "all", label: "All Agencies", count: 156 },
    { value: "coastal-districts", label: "Coastal Districts", count: 25 },
    { value: "police", label: "Coastal Police", count: 45 },
    { value: "coast-guard", label: "Coast Guard", count: 12 },
    { value: "ndma", label: "NDMA/SDMA", count: 8 },
    { value: "media", label: "Media Outlets", count: 18 },
  ];

  const alertTemplates = [
    {
      id: "tsunami",
      title: "Tsunami Warning",
      message: "TSUNAMI WARNING: High-magnitude earthquake detected. Immediate evacuation recommended for coastal areas within 5km of shoreline. Move to higher ground immediately.",
      severity: "critical" as const
    },
    {
      id: "storm",
      title: "Storm Surge Advisory", 
      message: "STORM SURGE ADVISORY: Severe weather conditions expected. Coastal communities advised to move to higher ground. Avoid low-lying areas.",
      severity: "high" as const
    },
    {
      id: "cyclone",
      title: "Cyclone Alert",
      message: "CYCLONE ALERT: Severe cyclonic storm approaching coast. All fishing activities suspended. Evacuation of vulnerable areas recommended.",
      severity: "critical" as const
    }
  ];

  const handleTemplateSelect = (template: typeof alertTemplates[0]) => {
    setAlertTitle(template.title);
    setAlertMessage(template.message);
    setAlertSeverity(template.severity);
  };

  const handleSendAlert = async () => {
    if (!alertMessage.trim() || !selectedRecipients || !alertTitle.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before sending.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    
    try {
      const selectedGroup = recipientGroups.find(g => g.value === selectedRecipients);
      const alertId = sendAlert({
        title: alertTitle,
        message: alertMessage,
        recipients: [selectedRecipients],
        severity: alertSeverity,
        recipientCount: selectedGroup?.count || 0
      });

      toast({
        title: "Alert Sent Successfully",
        description: `Alert "${alertTitle}" has been sent to ${selectedGroup?.label}.`,
      });

      // Clear form
      setAlertTitle("");
      setAlertMessage("");
      setSelectedRecipients("");
      setAlertSeverity("medium");
      
    } catch (error) {
      toast({
        title: "Failed to Send Alert",
        description: "There was an error sending the alert. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const generatePDF = () => {
    toast({
      title: "PDF Generated",
      description: "Alert document has been generated and downloaded.",
    });
  };

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
            <Label className="dashboard-label">Quick Templates</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              {alertTemplates.map((template) => (
                <Button 
                  key={template.id}
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTemplateSelect(template)}
                  className="text-left justify-start h-auto p-3"
                >
                  <div>
                    <div className="font-medium text-sm">{template.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{template.severity} severity</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Alert Title */}
          <div>
            <Label htmlFor="alert-title" className="dashboard-label">Alert Title</Label>
            <Input
              id="alert-title"
              placeholder="Enter alert title..."
              value={alertTitle}
              onChange={(e) => setAlertTitle(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Message Content */}
          <div>
            <Label htmlFor="alert-message" className="dashboard-label">Alert Message</Label>
            <Textarea
              id="alert-message"
              placeholder="Enter advisory message..."
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              className="min-h-[120px] mt-2"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {alertMessage.length}/500 characters
            </div>
          </div>

          {/* Recipients and Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="dashboard-label">Recipients</Label>
              <Select value={selectedRecipients} onValueChange={setSelectedRecipients}>
                <SelectTrigger className="mt-2">
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select recipient groups..." />
                </SelectTrigger>
                <SelectContent>
                  {recipientGroups.map((group) => (
                    <SelectItem key={group.value} value={group.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{group.label}</span>
                        <Badge variant="outline" className="ml-2">{group.count}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="dashboard-label">Severity Level</Label>
              <Select value={alertSeverity} onValueChange={(value: any) => setAlertSeverity(value)}>
                <SelectTrigger className="mt-2">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              className="flex-1" 
              onClick={handleSendAlert}
              disabled={isSending || !alertMessage.trim() || !selectedRecipients || !alertTitle.trim()}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isSending ? "Sending..." : "Send Alert"}
            </Button>
            <Button variant="outline" onClick={generatePDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>

          {/* Preview */}
          {alertMessage && (
            <div className="border border-border rounded-lg p-4 bg-muted/50">
              <div className="text-sm font-medium mb-2">Preview:</div>
              <div className="text-sm">
                <div className="font-medium mb-1">{alertTitle || "Alert Title"}</div>
                <div className="text-muted-foreground">{alertMessage}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={
                    alertSeverity === 'critical' ? 'destructive' :
                    alertSeverity === 'high' ? 'destructive' :
                    'secondary'
                  }>
                    {alertSeverity}
                  </Badge>
                  {selectedRecipients && (
                    <span className="text-xs text-muted-foreground">
                      To: {recipientGroups.find(g => g.value === selectedRecipients)?.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
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
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <Badge className={`text-xs ${
                        alert.severity === 'critical' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                        alert.severity === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                        alert.severity === 'medium' ? 'bg-warning/10 text-warning border-warning/20' :
                        'bg-success/10 text-success border-success/20'
                      }`}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>Recipients: {alert.recipientCount} contacts</span>
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {alert.message}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {getStatusIcon(alert.status)}
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(alert.sentAt).toLocaleTimeString()}
                    </span>
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
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      View Details
                    </Button>
                    {alert.status === "sent" && (
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        Resend
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {alerts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <div className="text-sm">No alerts sent yet</div>
                <div className="text-xs">Alerts will appear here once sent</div>
              </div>
            )}
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