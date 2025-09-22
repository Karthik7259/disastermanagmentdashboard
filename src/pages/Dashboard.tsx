import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardCards from "@/components/DashboardCards";
import LiveMap from "@/components/LiveMap";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import ActivityTimeline from "@/components/ActivityTimeline";
import AlertSystem from "@/components/AlertSystem";
import { HazardData, ReportData } from "@/hooks/useDashboardData";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [selectedView, setSelectedView] = useState<string>("dashboard");

  const handleCardClick = (cardType: string) => {
    switch (cardType) {
      case "hazards":
        toast({
          title: "Active Hazards",
          description: "Switching to hazards view...",
        });
        break;
      case "reports":
        toast({
          title: "Reports View", 
          description: "Displaying all reports...",
        });
        break;
      case "population":
        toast({
          title: "Population Analysis",
          description: "Showing affected population data...",
        });
        break;
      case "alerts":
        toast({
          title: "Alert History",
          description: "Displaying sent alerts...",
        });
        break;
    }
  };

  const handleMapMarkerClick = (item: HazardData | ReportData) => {
    const itemType = 'type' in item && 'affectedPopulation' in item ? 'hazard' : 'report';
    toast({
      title: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Selected`,
      description: `Viewing details for ${item.location}`,
    });
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <DashboardHeader />
      
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Overview KPIs */}
          <DashboardCards onCardClick={handleCardClick} />
          
          {/* Live Map Section */}
          <LiveMap onMarkerClick={handleMapMarkerClick} />
          
          {/* Analytics Charts */}
          <AnalyticsCharts />
          
          {/* Bottom Section - Activity and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ActivityTimeline />
            </div>
            <div className="lg:col-span-2">
              <AlertSystem />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;