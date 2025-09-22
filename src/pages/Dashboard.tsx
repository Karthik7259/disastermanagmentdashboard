import DashboardHeader from "@/components/DashboardHeader";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardCards from "@/components/DashboardCards";
import LiveMap from "@/components/LiveMap";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import ActivityTimeline from "@/components/ActivityTimeline";
import AlertSystem from "@/components/AlertSystem";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <DashboardHeader />
      
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Overview KPIs */}
          <DashboardCards />
          
          {/* Live Map Section */}
          <LiveMap />
          
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