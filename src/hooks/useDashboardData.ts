import { useState, useEffect } from "react";

export interface HazardData {
  id: string;
  type: "tsunami" | "storm" | "cyclone" | "earthquake";
  location: string;
  coordinates: { lat: number; lng: number };
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "monitoring" | "resolved";
  reportedAt: Date;
  description: string;
  affectedPopulation: number;
}

export interface ReportData {
  id: string;
  source: "citizen" | "social_media" | "official" | "sensor";
  location: string;
  coordinates: { lat: number; lng: number };
  type: string;
  severity: "low" | "medium" | "high";
  reportedAt: Date;
  content: string;
  verified: boolean;
}

export interface AlertData {
  id: string;
  title: string;
  message: string;
  recipients: string[];
  severity: "low" | "medium" | "high" | "critical";
  status: "draft" | "sending" | "sent" | "failed";
  sentAt: Date;
  recipientCount: number;
}

// Demo data generators
const generateHazards = (): HazardData[] => [
  {
    id: "1",
    type: "tsunami",
    location: "Bay of Bengal - Chennai Coast",
    coordinates: { lat: 13.0827, lng: 80.2707 },
    severity: "high",
    status: "active",
    reportedAt: new Date(Date.now() - 10 * 60 * 1000),
    description: "7.2 magnitude earthquake detected 150km SE of Chennai. Tsunami waves expected.",
    affectedPopulation: 45000
  },
  {
    id: "2",
    type: "storm",
    location: "Arabian Sea - Goa Coast",
    coordinates: { lat: 15.2993, lng: 74.1240 },
    severity: "medium",
    status: "monitoring",
    reportedAt: new Date(Date.now() - 45 * 60 * 1000),
    description: "Storm surge warning due to severe weather depression.",
    affectedPopulation: 12000
  },
  {
    id: "3",
    type: "cyclone",
    location: "Bay of Bengal - Odisha",
    coordinates: { lat: 20.9517, lng: 85.0985 },
    severity: "critical",
    status: "active",
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    description: "Cyclone Amphan moving towards coast at 15 km/hr.",
    affectedPopulation: 150000
  }
];

const generateReports = (): ReportData[] => [
  {
    id: "1",
    source: "citizen",
    location: "Marina Beach, Chennai",
    coordinates: { lat: 13.0478, lng: 80.2785 },
    type: "Unusual wave activity",
    severity: "high",
    reportedAt: new Date(Date.now() - 5 * 60 * 1000),
    content: "Witnessing abnormally high waves and water receding rapidly from shore.",
    verified: true
  },
  {
    id: "2",
    source: "social_media",
    location: "Panaji, Goa",
    coordinates: { lat: 15.4909, lng: 73.8278 },
    type: "Flooding reports",
    severity: "medium",
    reportedAt: new Date(Date.now() - 20 * 60 * 1000),
    content: "Multiple social media posts reporting coastal road flooding.",
    verified: false
  },
  {
    id: "3",
    source: "official",
    location: "Puri, Odisha",
    coordinates: { lat: 19.8135, lng: 85.8312 },
    type: "Weather station alert",
    severity: "high",
    reportedAt: new Date(Date.now() - 30 * 60 * 1000),
    content: "Wind speed exceeded 120 km/hr with heavy rainfall.",
    verified: true
  }
];

export const useDashboardData = () => {
  const [hazards, setHazards] = useState<HazardData[]>(generateHazards());
  const [reports, setReports] = useState<ReportData[]>(generateReports());
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new reports
      if (Math.random() > 0.7) {
        const newReport: ReportData = {
          id: Date.now().toString(),
          source: ["citizen", "social_media", "sensor"][Math.floor(Math.random() * 3)] as any,
          location: ["Mumbai Coast", "Kochi Beach", "Visakhapatnam Port"][Math.floor(Math.random() * 3)],
          coordinates: { 
            lat: 15 + Math.random() * 10, 
            lng: 72 + Math.random() * 15 
          },
          type: ["Wave patterns", "Flooding", "Strong winds"][Math.floor(Math.random() * 3)],
          severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
          reportedAt: new Date(),
          content: "Automated report generated from monitoring system.",
          verified: Math.random() > 0.5
        };
        
        setReports(prev => [newReport, ...prev.slice(0, 19)]); // Keep last 20 reports
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const sendAlert = (alertData: Omit<AlertData, "id" | "status" | "sentAt">) => {
    const newAlert: AlertData = {
      ...alertData,
      id: Date.now().toString(),
      status: "sending",
      sentAt: new Date()
    };

    setAlerts(prev => [newAlert, ...prev]);
    
    // Simulate sending process
    setTimeout(() => {
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === newAlert.id 
            ? { ...alert, status: "sent" } 
            : alert
        )
      );
    }, 3000);

    return newAlert.id;
  };

  const updateHazardStatus = (hazardId: string, status: HazardData["status"]) => {
    setHazards(prev => 
      prev.map(hazard => 
        hazard.id === hazardId 
          ? { ...hazard, status }
          : hazard
      )
    );
  };

  const verifyReport = (reportId: string) => {
    setReports(prev =>
      prev.map(report =>
        report.id === reportId
          ? { ...report, verified: true }
          : report
      )
    );
  };

  // Statistics calculations
  const stats = {
    activeHazards: hazards.filter(h => h.status === "active").length,
    reportsToday: reports.filter(r => 
      r.reportedAt.toDateString() === new Date().toDateString()
    ).length,
    citizensAtRisk: hazards.reduce((sum, h) => sum + h.affectedPopulation, 0),
    alertsSent: alerts.filter(a => a.status === "sent").length
  };

  return {
    hazards,
    reports,
    alerts,
    stats,
    isLoading,
    sendAlert,
    updateHazardStatus,
    verifyReport,
    setIsLoading
  };
};