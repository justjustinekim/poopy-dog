
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthInsight, PoopEntry } from "@/types";
import { AlertTriangle, CheckCircle, Info, BarChart2, Stethoscope, Calendar } from "lucide-react";
import { format, subDays } from "date-fns";
import { Button } from "@/components/ui/button";

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

  // Check for any high severity insights that require vet attention
  const criticalInsights = insights.filter(insight => insight.severity === 'high');
  const hasVetRecommendation = insights.some(
    insight => insight.recommendation?.toLowerCase().includes('vet')
  );

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
            {/* Vet Alert Banner - Only show if there are critical insights */}
            {hasVetRecommendation && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <Stethoscope className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-700 dark:text-red-400">Veterinary Attention Recommended</h3>
                    <p className="text-sm mt-1 text-red-600 dark:text-red-300">
                      Some health insights indicate that you should consult a veterinarian about {dogName}'s digestive health.
                    </p>
                    <Button variant="destructive" size="sm" className="mt-3">
                      Find a Vet Near Me
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                Recent Activity (Last 7 Days)
              </h3>
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
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Info className="mr-2 h-4 w-4 text-primary" />
                Health Insights
              </h3>
              {insights.length > 0 ? (
                <div className="space-y-3">
                  {/* First display high severity insights */}
                  {insights
                    .sort((a, b) => {
                      // Sort by severity: high -> medium -> low
                      const severityOrder = { high: 0, medium: 1, low: 2 };
                      return severityOrder[a.severity as keyof typeof severityOrder] - 
                             severityOrder[b.severity as keyof typeof severityOrder];
                    })
                    .map((insight, index) => (
                      <div 
                        key={index} 
                        className={`bg-background/50 p-4 rounded-md ${
                          insight.severity === 'high' ? 'border-l-4 border-red-500' : 
                          insight.severity === 'medium' ? 'border-l-4 border-yellow-500' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getSeverityIcon(insight.severity)}
                          </div>
                          <div>
                            <h4 className="font-medium">{insight.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                            {insight.recommendation && (
                              <p className={`text-sm mt-2 border-l-2 pl-3 ${
                                insight.recommendation.toLowerCase().includes('vet') 
                                  ? 'border-red-500 font-medium' 
                                  : 'border-primary'
                              }`}>
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
