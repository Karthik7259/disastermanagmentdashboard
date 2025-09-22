import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Layers,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize,
  MapPin,
  Waves,
  Wind,
  AlertTriangle,
  Eye,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useDashboardData, HazardData, ReportData } from "@/hooks/useDashboardData";

interface LiveMapProps {
  onMarkerClick?: (item: HazardData | ReportData) => void;
}

const LiveMap = ({ onMarkerClick }: LiveMapProps) => {
  const { hazards, reports, updateHazardStatus, verifyReport } = useDashboardData();
  const [selectedLayer, setSelectedLayer] = useState("all");
  const [selectedItem, setSelectedItem] = useState<HazardData | ReportData | null>(null);
  const [mapZoom, setMapZoom] = useState(1);

  // Filter data based on selected layer
  const visibleHazards = selectedLayer === "all" || selectedLayer === "hazards" ? hazards : [];
  const visibleReports = selectedLayer === "all" || selectedLayer === "reports" ? reports : [];

  const layerTypes = [
    { value: "all", label: "All Layers" },
    { value: "hazards", label: "Active Hazards" },
    { value: "reports", label: "Citizen Reports" },
    { value: "tsunami", label: "Tsunami Zones" },
    { value: "storm", label: "Storm Surge" },
  ];

  const getMarkerIcon = (item: HazardData | ReportData) => {
    if ('type' in item && item.type) {
      switch (item.type) {
        case "tsunami": return <Waves className="h-3 w-3" />;
        case "storm": return <Wind className="h-3 w-3" />;
        case "cyclone": return <AlertTriangle className="h-3 w-3" />;
        default: return <MapPin className="h-3 w-3" />;
      }
    }
    return <MapPin className="h-3 w-3" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-600";
      case "high": return "bg-red-500";
      case "medium": return "bg-orange-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const handleItemClick = (item: HazardData | ReportData) => {
    setSelectedItem(item);
    onMarkerClick?.(item);
  };

  const handleStatusUpdate = (itemId: string, newStatus: string) => {
    if ('type' in selectedItem!) {
      updateHazardStatus(itemId, newStatus as HazardData["status"]);
    } else {
      verifyReport(itemId);
    }
    setSelectedItem(null);
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Live Hazard Map
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedLayer} onValueChange={setSelectedLayer}>
              <SelectTrigger className="w-40">
                <Layers className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {layerTypes.map((layer) => (
                  <SelectItem key={layer.value} value={layer.value}>
                    {layer.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Map Container */}
        <div className="relative h-96 bg-muted rounded-lg overflow-hidden border">
          {/* Map placeholder with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100">
            {/* Grid pattern for map feel */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-12 gap-px h-full">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div key={i} className="bg-primary"></div>
                ))}
              </div>
            </div>
            
            {/* Hazard markers */}
            {visibleHazards.map((hazard) => (
              <div
                key={`hazard-${hazard.id}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${Math.min(90, Math.max(10, (hazard.coordinates.lng - 68) * 4 + 20))}%`,
                  top: `${Math.min(90, Math.max(10, (28 - hazard.coordinates.lat) * 4 + 10))}%`,
                }}
                onClick={() => handleItemClick(hazard)}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white ${getSeverityColor(hazard.severity)} ${
                    hazard.status === 'active' ? 'animate-pulse' : ''
                  }`}
                >
                  {getMarkerIcon(hazard)}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg p-2 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div className="font-medium">{hazard.location}</div>
                  <div className="text-muted-foreground capitalize">{hazard.type} - {hazard.severity}</div>
                  <div className="text-xs text-muted-foreground">{hazard.status}</div>
                </div>
              </div>
            ))}

            {/* Report markers */}
            {visibleReports.map((report) => (
              <div
                key={`report-${report.id}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${Math.min(90, Math.max(10, (report.coordinates.lng - 68) * 4 + 20))}%`,
                  top: `${Math.min(90, Math.max(10, (28 - report.coordinates.lat) * 4 + 10))}%`,
                }}
                onClick={() => handleItemClick(report)}
              >
                <div
                  className={`w-4 h-4 rounded-full border border-white shadow-md ${getSeverityColor(report.severity)} ${
                    !report.verified ? 'opacity-60' : ''
                  }`}
                ></div>
                {/* Tooltip */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg p-2 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div className="font-medium">{report.location}</div>
                  <div className="text-muted-foreground">{report.type}</div>
                  <div className="text-xs text-muted-foreground">{report.source} - {report.verified ? 'Verified' : 'Unverified'}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-10 h-10 p-0"
              onClick={() => setMapZoom(prev => Math.min(3, prev + 0.5))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-10 h-10 p-0"
              onClick={() => setMapZoom(prev => Math.max(0.5, prev - 0.5))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="w-10 h-10 p-0">
              <Maximize className="h-4 w-4" />
            </Button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-card/95 border border-border rounded-lg p-3 text-xs">
            <div className="font-medium mb-2">Legend</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span>Critical/High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Medium Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Low Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full opacity-60"></div>
                <span>Unverified Report</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Hazard Summary */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {hazards.filter(h => h.status === 'active').slice(0, 3).map((hazard) => (
            <div 
              key={hazard.id}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                hazard.severity === 'critical' ? 'bg-destructive/5 border-destructive/20' :
                hazard.severity === 'high' ? 'bg-destructive/5 border-destructive/20' :
                hazard.severity === 'medium' ? 'bg-warning/5 border-warning/20' :
                'bg-muted/50 border-border'
              }`}
              onClick={() => handleItemClick(hazard)}
            >
              <div className={`p-2 rounded-full ${
                hazard.severity === 'critical' || hazard.severity === 'high' ? 'bg-destructive/10' :
                hazard.severity === 'medium' ? 'bg-warning/10' :
                'bg-muted'
              }`}>
                {getMarkerIcon(hazard)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{hazard.type.charAt(0).toUpperCase() + hazard.type.slice(1)} Alert</div>
                <div className="text-xs text-muted-foreground">{hazard.location}</div>
              </div>
              <Badge variant={
                hazard.severity === 'critical' ? 'destructive' :
                hazard.severity === 'high' ? 'destructive' :
                hazard.severity === 'medium' ? 'secondary' :
                'outline'
              }>
                {hazard.severity}
              </Badge>
            </div>
          ))}
        </div>

        {/* Item Details Modal */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedItem && getMarkerIcon(selectedItem)}
                {selectedItem?.location}
              </DialogTitle>
            </DialogHeader>
            
            {selectedItem && (
              <div className="space-y-4">
                {'type' in selectedItem && 'affectedPopulation' in selectedItem ? (
                  // Hazard details
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">Type:</span>
                        <p className="text-sm text-muted-foreground capitalize">{selectedItem.type}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Severity:</span>
                        <Badge className="ml-2" variant={
                          selectedItem.severity === 'critical' ? 'destructive' :
                          selectedItem.severity === 'high' ? 'destructive' :
                          'secondary'
                        }>
                          {selectedItem.severity}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Status:</span>
                        <Badge className="ml-2" variant="outline">{selectedItem.status}</Badge>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Affected Population:</span>
                        <p className="text-sm text-muted-foreground">{selectedItem.affectedPopulation.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium">Description:</span>
                      <p className="text-sm text-muted-foreground mt-1">{selectedItem.description}</p>
                    </div>

                    <div className="flex gap-2 pt-4">
                      {selectedItem.status === 'active' && (
                        <Button size="sm" onClick={() => handleStatusUpdate(selectedItem.id, 'monitoring')}>
                          <Eye className="h-4 w-4 mr-2" />
                          Set to Monitoring
                        </Button>
                      )}
                      {selectedItem.status === 'monitoring' && (
                        <Button size="sm" onClick={() => handleStatusUpdate(selectedItem.id, 'resolved')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Resolved
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Send Alert
                      </Button>
                    </div>
                  </>
                ) : (
                  // Report details
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">Source:</span>
                        <p className="text-sm text-muted-foreground capitalize">{selectedItem.source.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Type:</span>
                        <p className="text-sm text-muted-foreground">{selectedItem.type}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Severity:</span>
                        <Badge className="ml-2" variant="secondary">{selectedItem.severity}</Badge>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Status:</span>
                        <Badge className="ml-2" variant={selectedItem.verified ? "default" : "outline"}>
                          {selectedItem.verified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium">Content:</span>
                      <p className="text-sm text-muted-foreground mt-1">{selectedItem.content}</p>
                    </div>

                    <div className="flex gap-2 pt-4">
                      {!selectedItem.verified && (
                        <Button size="sm" onClick={() => handleStatusUpdate(selectedItem.id, 'verified')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify Report
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Escalate
                      </Button>
                    </div>
                  </>
                )}
                
                <div className="text-xs text-muted-foreground border-t pt-2">
                  Reported: {selectedItem.reportedAt.toLocaleString()}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LiveMap;