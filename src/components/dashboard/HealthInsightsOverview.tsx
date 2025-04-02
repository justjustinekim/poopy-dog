
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthInsight, PoopEntry } from "@/types";
import { AlertTriangle, CheckCircle, Info, BarChart2, Stethoscope, Calendar, Utensils, Zap, Droplets } from "lucide-react";
import { format, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

  // Calculate overall digestive health score (simplified model)
  const calculateHealthScore = () => {
    // Count good indicators
    const goodCount = recentEntries.filter(entry => 
      entry.consistency === "normal" && entry.color === "brown"
    ).length;
    
    // Return a percentage based on good entries vs total
    if (recentEntries.length === 0) return 0;
    return Math.round((goodCount / recentEntries.length) * 100);
  };

  const healthScore = calculateHealthScore();

  return (
    <div className="space-y-6">
      <Card className="glass-card overflow-hidden">
        <CardHeader className="relative bg-gradient-to-r from-primary/10 to-primary/5 pb-8">
          <CardTitle className="flex items-center">
            <Stethoscope className="mr-2 h-5 w-5 text-primary" />
            {dogName}'s Gut Health Overview
          </CardTitle>
          <CardDescription>
            Holistic analysis based on {entries.length} entries and recent activity
          </CardDescription>
          
          {/* Health Score */}
          <div className="absolute right-8 top-8">
            <div className="relative w-20 h-20 rounded-full bg-background flex items-center justify-center">
              <div 
                className="absolute inset-0 rounded-full" 
                style={{
                  background: `conic-gradient(${healthScore >= 70 ? '#10b981' : healthScore >= 40 ? '#f59e0b' : '#ef4444'} ${healthScore}%, transparent 0)`,
                  mask: 'radial-gradient(white 55%, transparent 0)',
                  WebkitMask: 'radial-gradient(white 55%, transparent 0)'
                }}
              ></div>
              <span className="text-2xl font-bold">{healthScore}%</span>
            </div>
            <div className="text-center mt-1 text-xs font-medium">Gut Health</div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
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

            {/* Digestive health summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-background/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    <Utensils className="h-4 w-4 mr-2 text-primary" />
                    Food & Digestion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {colorCounts && Object.keys(colorCounts).length > 0 ? (
                    <div className="space-y-2 text-sm">
                      <p>Based on stool color analysis, {dogName}'s food digestion appears to be 
                        <span className={`font-semibold ${colorCounts['brown'] ? 'text-green-500' : 'text-yellow-500'}`}>
                          {colorCounts['brown'] ? ' normal' : ' showing signs of imbalance'}
                        </span>.
                      </p>
                      <div className="text-xs text-muted-foreground mt-2">
                        Recommendation: {colorCounts['brown'] ? 'Continue current diet.' : 'Consider diet adjustments and monitor for changes.'}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent data available for analysis.</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-background/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    <Zap className="h-4 w-4 mr-2 text-primary" />
                    Digestive Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {consistencyCounts && Object.keys(consistencyCounts).length > 0 ? (
                    <div className="space-y-2 text-sm">
                      <p>Stool consistency indicates 
                        <span className={`font-semibold ${consistencyCounts['normal'] ? 'text-green-500' : 'text-yellow-500'}`}>
                          {consistencyCounts['normal'] ? ' efficient' : ' potentially inefficient'} digestion
                        </span>.
                      </p>
                      <div className="text-xs text-muted-foreground mt-2">
                        Recommendation: {consistencyCounts['normal'] ? 'Maintain current feeding schedule.' : 'Consider smaller, more frequent meals or adding fiber.'}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent data available for analysis.</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-background/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    <Droplets className="h-4 w-4 mr-2 text-primary" />
                    Hydration Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>Based on stool consistency, {dogName}'s hydration appears to be 
                      <span className={`font-semibold ${
                        consistencyCounts && (consistencyCounts['liquid'] || consistencyCounts['soft']) 
                          ? 'text-yellow-500'
                          : (consistencyCounts && consistencyCounts['solid'] ? 'text-yellow-500' : 'text-green-500')
                      }`}>
                      {consistencyCounts && (consistencyCounts['liquid'] || consistencyCounts['soft']) 
                        ? ' excessive'
                        : (consistencyCounts && consistencyCounts['solid'] ? ' insufficient' : ' adequate')}
                      </span>.
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      Recommendation: {
                        consistencyCounts && (consistencyCounts['liquid'] || consistencyCounts['soft'])
                          ? 'Monitor water intake, ensure food isn\'t too wet.'
                          : (consistencyCounts && consistencyCounts['solid'] 
                              ? 'Increase fresh water availability.'
                              : 'Continue providing fresh water consistently.')
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Health Insights */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Info className="mr-2 h-5 w-5 text-primary" />
                Detailed Health Insights
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
                <div className="bg-background/50 p-6 rounded-md text-center">
                  <Info className="mx-auto h-10 w-10 text-primary/30 mb-2" />
                  <p className="text-muted-foreground">No health insights available yet. Continue tracking entries to generate insights.</p>
                </div>
              )}
            </div>
            
            {/* Lifestyle tips */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Holistic Gut Health Tips for {dogName}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex">
                    <span className="mr-2 text-primary">•</span>
                    <span>Regular exercise helps stimulate healthy bowel movements</span>
                  </li>
                  <li className="flex">
                    <span className="mr-2 text-primary">•</span>
                    <span>Avoid sudden diet changes which can upset digestion</span>
                  </li>
                  <li className="flex">
                    <span className="mr-2 text-primary">•</span>
                    <span>Probiotic supplements can help maintain gut flora balance</span>
                  </li>
                  <li className="flex">
                    <span className="mr-2 text-primary">•</span>
                    <span>Stress can impact digestive health - maintain a calm environment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthInsightsOverview;
