import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Activity, PieChart as PieChartIcon, BarChart3 } from "lucide-react";

// Mock data for charts
const hazardTrendData = [
  { date: "Jan", reports: 24, severity: 2.3 },
  { date: "Feb", reports: 31, severity: 2.8 },
  { date: "Mar", reports: 42, severity: 3.1 },
  { date: "Apr", reports: 38, severity: 2.9 },
  { date: "May", reports: 55, severity: 3.4 },
  { date: "Jun", reports: 48, severity: 3.0 },
];

const sentimentData = [
  { sentiment: "Positive", value: 45, color: "#22c55e" },
  { sentiment: "Neutral", value: 35, color: "#64748b" },
  { sentiment: "Negative", value: 20, color: "#ef4444" },
];

const sourceData = [
  { source: "INCOIS Models", count: 45 },
  { source: "Citizen App", count: 89 },
  { source: "Social Media", count: 34 },
  { source: "Coast Guard", count: 23 },
  { source: "Police Reports", count: 18 },
];

const riskScoreData = [
  { region: "Chennai", risk: 8.5 },
  { region: "Mumbai", risk: 6.2 },
  { region: "Kolkata", risk: 7.8 },
  { region: "Goa", risk: 4.3 },
  { region: "Kochi", risk: 5.9 },
];

const AnalyticsCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Hazard Trend Chart */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Hazard Reports Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hazardTrendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="reports" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sentiment Analysis */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Public Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ sentiment, value }) => `${sentiment}: ${value}%`}
                labelLine={false}
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Report Sources */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Report Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="source" 
                className="text-xs"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--accent))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Scoring */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Regional Risk Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskScoreData.map((item) => (
              <div key={item.region} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="font-medium text-sm">{item.region}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.risk >= 7 ? "bg-destructive" :
                        item.risk >= 5 ? "bg-warning" :
                        "bg-success"
                      }`}
                      style={{ width: `${(item.risk / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${
                    item.risk >= 7 ? "text-destructive" :
                    item.risk >= 5 ? "text-warning" :
                    "text-success"
                  }`}>
                    {item.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCharts;