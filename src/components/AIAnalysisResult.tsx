
import React from "react";
import { HealthInsight, PoopColor, PoopConsistency } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, CheckCircle, AlertCircle, Loader2, Palette, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AIAnalysisResultProps {
  isLoading: boolean;
  isPoop?: boolean;
  confidence?: number;
  color?: PoopColor;
  consistency?: PoopConsistency;
  colorSpectrum?: string;
  insights: HealthInsight[];
  className?: string;
}

const AIAnalysisResult: React.FC<AIAnalysisResultProps> = ({
  isLoading,
  isPoop,
  confidence,
  color,
  consistency,
  colorSpectrum,
  insights,
  className
}) => {
  // Helper function to get color classes based on poop color
  const getColorBadgeClass = (poopColor?: PoopColor) => {
    switch(poopColor) {
      case "brown": return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "green": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "yellow": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "red": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "black": return "bg-slate-100 text-slate-800 hover:bg-slate-100";
      case "white": return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getConsistencyBadgeClass = (poopConsistency?: PoopConsistency) => {
    switch(poopConsistency) {
      case "normal": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "soft": return "bg-sky-100 text-sky-800 hover:bg-sky-100";
      case "liquid": return "bg-cyan-100 text-cyan-800 hover:bg-cyan-100";
      case "solid": return "bg-violet-100 text-violet-800 hover:bg-violet-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Check if any insight recommends a vet visit
  const needsVetVisit = insights.some(insight => 
    insight.recommendation?.toLowerCase().includes('vet') || 
    (insight.severity === 'high' && (
      color === 'black' || color === 'red' || color === 'green' || 
      consistency === 'liquid' || 
      color === 'white'
    ))
  );

  if (isLoading) {
    return (
      <Card className={cn("glass-card", className)}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5 text-primary" />
            AI Analysis
          </CardTitle>
          <CardDescription>Analyzing your dog's stool sample...</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="h-10 w-10 mb-4 text-primary animate-spin" />
            <p className="text-gray-500">Processing image with AI...</p>
            <p className="text-sm text-gray-400 mt-2">This will take a few seconds</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isPoop === undefined) {
    return null;
  }

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          AI Analysis
        </CardTitle>
        <CardDescription>
          {isPoop 
            ? "Analysis of your dog's stool sample" 
            : "Unable to analyze the image"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Detection confidence */}
        <div className="flex items-center gap-2 mb-4">
          {isPoop ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
              {Math.round((confidence || 0) * 100)}% confident this is a stool sample
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              {Math.round((confidence || 0) * 100)}% confident this is not a stool sample
            </Badge>
          )}
        </div>

        {/* Vet Visit Alert - Only show if necessary */}
        {isPoop && needsVetVisit && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                <Stethoscope className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-red-700 dark:text-red-400">Veterinary Attention Recommended</h3>
                <p className="text-sm mt-1 text-red-600 dark:text-red-300">
                  Based on this analysis, we recommend consulting a veterinarian about your dog's digestive health.
                </p>
                <Button variant="destructive" size="sm" className="mt-3">
                  Find a Vet Near Me
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Properties section */}
        {isPoop && (
          <div className="mb-4 p-4 bg-background/50 rounded-lg border">
            <h3 className="text-sm font-medium mb-2">Detected Properties</h3>
            <div className="flex flex-wrap gap-4">
              {color && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Color</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getColorBadgeClass(color)}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </Badge>
                    
                    {colorSpectrum && (
                      <div className="flex items-center gap-1">
                        <Palette className="h-3 w-3 text-gray-400" />
                        <div 
                          className="w-6 h-6 rounded-full border" 
                          style={{ backgroundColor: colorSpectrum }}
                          title="Detected color spectrum"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {consistency && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Consistency</span>
                  <Badge variant="outline" className={getConsistencyBadgeClass(consistency)}>
                    {consistency.charAt(0).toUpperCase() + consistency.slice(1)}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Insights section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Health Insights</h3>
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
                className={`p-3 rounded-lg border bg-background/50 ${
                  insight.severity === 'high' ? 'border-l-4 border-red-500' : 
                  insight.severity === 'medium' ? 'border-l-4 border-yellow-500' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="mr-3 pt-0.5">
                    {insight.severity === "low" && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {insight.severity === "medium" && (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    {insight.severity === "high" && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <h3 className="font-medium text-sm">{insight.title}</h3>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "ml-2 text-xs",
                          insight.severity === "low" && "bg-green-100 text-green-800 hover:bg-green-100",
                          insight.severity === "medium" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
                          insight.severity === "high" && "bg-red-100 text-red-800 hover:bg-red-100"
                        )}
                      >
                        {insight.severity === "low" && "Normal"}
                        {insight.severity === "medium" && "Monitor"}
                        {insight.severity === "high" && "Action needed"}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600">{insight.description}</p>
                    
                    {insight.recommendation && (
                      <div className={`mt-1 text-xs ${
                        insight.recommendation.toLowerCase().includes('vet') 
                          ? 'font-medium text-red-600 dark:text-red-400' 
                          : ''
                      }`}>
                        <span className="font-medium">Recommendation:</span> {insight.recommendation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAnalysisResult;
