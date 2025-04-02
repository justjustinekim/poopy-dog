
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dog, PoopEntry, HealthInsight } from "@/types";
import { Stethoscope, AlertTriangle, Info, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface GutHealthVisualizationProps {
  dog: Dog;
  entries: PoopEntry[];
  insights: HealthInsight[];
  className?: string;
}

const GutHealthVisualization: React.FC<GutHealthVisualizationProps> = ({
  dog,
  entries,
  insights,
  className
}) => {
  // Determine health status for different parts of the digestive system
  const getStomachHealth = () => {
    const hasStomachIssue = insights.some(
      insight => insight.title.toLowerCase().includes("green") || 
                 insight.title.toLowerCase().includes("yellow")
    );
    return hasStomachIssue ? "medium" : "low";
  };

  const getIntestineHealth = () => {
    const hasIntestineIssue = insights.some(
      insight => insight.title.toLowerCase().includes("consistency") ||
                 insight.title.toLowerCase().includes("soft") ||
                 insight.title.toLowerCase().includes("liquid")
    );
    return hasIntestineIssue ? "medium" : "low";
  };

  const getColonHealth = () => {
    const hasColonIssue = insights.some(
      insight => insight.title.toLowerCase().includes("red") ||
                 insight.title.toLowerCase().includes("black")
    );
    return hasColonIssue ? "high" : "low";
  };

  const stomachHealth = getStomachHealth();
  const intestineHealth = getIntestineHealth();
  const colonHealth = getColonHealth();

  const getStatusIcon = (severity: string) => {
    if (severity === "high") return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (severity === "medium") return <Info className="h-5 w-5 text-amber-500" />;
    return <Check className="h-5 w-5 text-green-500" />;
  };

  const getStatusColor = (severity: string) => {
    if (severity === "high") return "fill-red-500/30 stroke-red-500";
    if (severity === "medium") return "fill-amber-500/30 stroke-amber-500";
    return "fill-green-500/30 stroke-green-500";
  };

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Stethoscope className="mr-2 h-5 w-5 text-primary" />
          Interactive Gut Visualization
        </CardTitle>
        <CardDescription>
          A simplified view of {dog.name}'s digestive health based on recent activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-96 w-full bg-background/50 rounded-lg border p-4">
          {/* Dog silhouette with digestive system */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              width="300" 
              height="300" 
              viewBox="0 0 300 300" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-20"
            >
              {/* Simple dog silhouette */}
              <path d="M200,100 Q240,40 280,100 L280,150 Q280,190 250,200 L250,280 L200,280 L200,250 L100,250 L100,280 L50,280 L50,200 Q20,190 20,150 L20,100 Q60,40 100,100 Q120,80 150,90 Q180,80 200,100" 
                fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
            </svg>
          </div>
          
          {/* Digestive organs */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {/* Stomach */}
            <div className="relative">
              <svg width="80" height="50" viewBox="0 0 80 50" className="cursor-pointer" data-tooltip-id="stomach-tooltip">
                <ellipse cx="40" cy="25" rx="35" ry="20" className={cn("transition-colors", getStatusColor(stomachHealth))} strokeWidth="2" />
                <text x="40" y="30" textAnchor="middle" fill="currentColor" className="text-xs font-semibold">
                  Stomach
                </text>
              </svg>
              <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                {getStatusIcon(stomachHealth)}
              </div>
            </div>
          </div>
          
          {/* Small intestine */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <svg width="120" height="60" viewBox="0 0 120 60" className="cursor-pointer" data-tooltip-id="intestine-tooltip">
                <path d="M10,10 Q30,30 10,50 Q50,70 90,50 Q70,30 90,10 Q50,-10 10,10" 
                  className={cn("transition-colors", getStatusColor(intestineHealth))} strokeWidth="2" />
                <text x="50" y="35" textAnchor="middle" fill="currentColor" className="text-xs font-semibold">
                  Intestines
                </text>
              </svg>
              <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                {getStatusIcon(intestineHealth)}
              </div>
            </div>
          </div>
          
          {/* Colon */}
          <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <svg width="100" height="40" viewBox="0 0 100 40" className="cursor-pointer" data-tooltip-id="colon-tooltip">
                <path d="M10,20 Q50,40 90,20" className={cn("transition-colors", getStatusColor(colonHealth))} 
                  strokeWidth="8" strokeLinecap="round" />
                <text x="50" y="30" textAnchor="middle" fill="currentColor" className="text-xs font-semibold">
                  Colon
                </text>
              </svg>
              <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                {getStatusIcon(colonHealth)}
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-2 left-2 bg-background/80 p-2 rounded-md border">
            <h4 className="text-sm font-semibold mb-1">Health Status</h4>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500 mr-1"></div>
                <span>Good</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500 mr-1"></div>
                <span>Monitor</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500 mr-1"></div>
                <span>Concern</span>
              </div>
            </div>
          </div>
          
          {/* Health descriptions */}
          <div className="absolute top-2 right-2 max-w-xs bg-background/80 p-2 rounded-md border">
            <h4 className="text-sm font-semibold">Digestive Health Overview</h4>
            <p className="text-xs mt-1">
              This visualization shows {dog.name}'s gut health based on recent poop analysis. 
              Click on each organ for detailed information.
            </p>
          </div>
        </div>
        
        {/* Digestive tips */}
        <div className="mt-4 p-3 bg-primary/10 rounded-md">
          <h3 className="font-medium text-sm">Tips for {dog.name}'s Digestive Health</h3>
          <ul className="mt-2 text-xs space-y-1">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Ensure consistent feeding times to regulate digestion
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Provide plenty of fresh water to support healthy digestion
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Consider adding probiotics if consistent soft stools occur
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default GutHealthVisualization;
