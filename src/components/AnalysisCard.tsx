
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HealthInsight } from "@/types";
import { AlertTriangle, CheckCircle, AlertCircle, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisCardProps {
  insights: HealthInsight[];
  className?: string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ insights, className }) => {
  if (!insights.length) {
    return (
      <Card className={cn("glass-card", className)}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart2 className="mr-2 h-5 w-5 text-primary" />
            Health Insights
          </CardTitle>
          <CardDescription>Analysis of your dog's digestive health</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
            <AlertCircle className="h-12 w-12 mb-3 text-gray-300" />
            <p>No health insights available yet. Continue tracking to generate insights.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart2 className="mr-2 h-5 w-5 text-primary" />
          Health Insights
        </CardTitle>
        <CardDescription>Analysis of your dog's digestive health</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 rounded-lg border bg-background/50">
              <div className="flex items-start">
                <div className="mr-3 pt-0.5">
                  {insight.severity === "low" && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {insight.severity === "medium" && (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  {insight.severity === "high" && (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <h3 className="font-medium text-base">{insight.title}</h3>
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
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300">{insight.description}</p>
                  
                  {insight.recommendation && (
                    <div className="mt-2 text-sm">
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

export default AnalysisCard;
