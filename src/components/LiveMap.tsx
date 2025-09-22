import { useState } from "react";
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
  Layers,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize,
  MapPin,
  Waves,
  Wind,
  AlertTriangle,
} from "lucide-react";

const LiveMap = () => {
  const [selectedLayer, setSelectedLayer] = useState("all");

  // Mock map markers data
  const markers = [
    { id: 1, type: "tsunami", lat: 13.0827, lng: 80.2707, severity: "high", location: "Chennai Coast" },
    { id: 2, type: "storm", lat: 15.2993, lng: 74.1240, severity: "medium", location: "Goa" },
    { id: 3, type: "report", lat: 19.0760, lng: 72.8777, severity: "low", location: "Mumbai" },
  ];

  const layerTypes = [
    { value: "all", label: "All Layers" },
    { value: "tsunami", label: "Tsunami Zones" },
    { value: "storm", label: "Storm Surge" },
    { value: "reports", label: "Citizen Reports" },
    { value: "social", label: "Social Media" },
  ];

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
            
            {/* Mock map markers */}
            {markers.map((marker) => (
              <div
                key={marker.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${(marker.lng - 70) * 8}%`,
                  top: `${(25 - marker.lat) * 8}%`,
                }}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                    marker.severity === "high"
                      ? "bg-destructive"
                      : marker.severity === "medium"
                      ? "bg-warning"
                      : "bg-success"
                  } animate-pulse`}
                ></div>
                {/* Tooltip */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg p-2 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div className="font-medium">{marker.location}</div>
                  <div className="text-muted-foreground capitalize">{marker.type} - {marker.severity}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button variant="outline" size="sm" className="w-10 h-10 p-0">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="w-10 h-10 p-0">
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
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <span>High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span>Medium Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span>Low Risk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Hazard Summary */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
            <Waves className="h-6 w-6 text-destructive" />
            <div>
              <div className="font-medium text-sm">Tsunami Alert</div>
              <div className="text-xs text-muted-foreground">Bay of Bengal - 3 locations</div>
            </div>
            <Badge variant="destructive" className="ml-auto">High</Badge>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-warning/5 border border-warning/20 rounded-lg">
            <Wind className="h-6 w-6 text-warning" />
            <div>
              <div className="font-medium text-sm">Storm Surge</div>
              <div className="text-xs text-muted-foreground">West Coast - 2 locations</div>
            </div>
            <Badge variant="secondary" className="ml-auto">Medium</Badge>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 border border-border rounded-lg">
            <AlertTriangle className="h-6 w-6 text-muted-foreground" />
            <div>
              <div className="font-medium text-sm">Citizen Reports</div>
              <div className="text-xs text-muted-foreground">142 reports today</div>
            </div>
            <Badge variant="outline" className="ml-auto">Active</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveMap;