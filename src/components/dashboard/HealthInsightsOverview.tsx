
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthInsight, PoopEntry } from "@/types";
import { AlertTriangle, CheckCircle, Info, BarChart2 } from "lucide-react";
import { format, subDays } from "date-fns";

interface HealthInsightsOverviewProps {
  dogName: string;
  entries: PoopEntry[];
  insights: HealthInsight[];
}

const HealthInsightsOverview: React.FC<HealthInsightsOverviewProps> = ({
  dogName,
  entries,
  insights
}) => {
  // Get entries from the last 7 days
  const last7Days = subDays(new Date(), 7);
  const recentEntries = entries.filter(
    entry => new Date(entry.date) >= last7Days
  );

  // Count by consistency type
  const consistencyCounts = recentEntries.reduce((acc, entry) => {
    acc[entry.consistency] = (acc[entry.consistency] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Count by color
  const colorCounts = recentEntries.reduce((acc, entry) => {
    acc[entry.color] = (acc[entry.color] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Info className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart2 className="mr-2 h-5 w-5 text-primary" />
            Health Summary for {dogName}
          </CardTitle>
          <CardDescription>
            Based on {entries.length} entries and recent activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Recent Activity Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Recent Activity (Last 7 Days)</h3>
              {recentEntries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background/50 p-4 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Consistency</h4>
                    <div className="space-y-2">
                      {Object.entries(consistencyCounts).map(([consistency, count]) => (
                        <div key={consistency} className="flex justify-between items-center">
                          <span className="capitalize">{consistency}</span>
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {count} {count === 1 ? 'time' : 'times'}
                          </span>
                        </div>
                      ))}
                      {Object.keys(consistencyCounts).length === 0 && (
                        <p className="text-sm text-muted-foreground">No data available</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-background/50 p-4 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Color</h4>
                    <div className="space-y-2">
                      {Object.entries(colorCounts).map(([color, count]) => (
                        <div key={color} className="flex justify-between items-center">
                          <span className="capitalize">{color}</span>
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {count} {count === 1 ? 'time' : 'times'}
                          </span>
                        </div>
                      ))}
                      {Object.keys(colorCounts).length === 0 && (
                        <p className="text-sm text-muted-foreground">No data available</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No recent entries available</p>
              )}
            </div>

            {/* Health Insights */}
            <div>
              <h3 className="text-lg font-medium mb-2">Health Insights</h3>
              {insights.length > 0 ? (
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <div key={index} className="bg-background/50 p-4 rounded-md">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getSeverityIcon(insight.severity)}
                        </div>
                        <div>
                          <h4 className="font-medium">{insight.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                          {insight.recommendation && (
                            <p className="text-sm mt-2 border-l-2 border-primary pl-3">
                              <span className="font-medium">Recommendation:</span> {insight.recommendation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No health insights available</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthInsightsOverview;
