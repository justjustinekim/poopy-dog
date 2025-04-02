
import { HealthInsight, PoopColor, PoopConsistency } from "@/types";

// Generate insights based on color and consistency
export function generateInsightsFromAnalysis(
  color?: PoopColor, 
  consistency?: PoopConsistency
): HealthInsight[] {
  const insights: HealthInsight[] = [];
  
  // Add color-based insights
  if (color) {
    addColorBasedInsights(insights, color);
  }
  
  // Add consistency-based insights
  if (consistency) {
    addConsistencyBasedInsights(insights, consistency);
  }
  
  return insights;
}

// Helper function to add color-based insights
function addColorBasedInsights(insights: HealthInsight[], color: PoopColor): void {
  if (color === "brown") {
    insights.push({
      title: "Normal Color",
      description: "Brown coloration indicates normal digestion.",
      severity: "low", // Green - normal/healthy
    });
  } else if (color === "green") {
    insights.push({
      title: "Green Stool",
      description: "Green stool may indicate food moving too quickly through the intestines or consumption of leafy greens.",
      severity: "medium", // Yellow - monitor situation
      recommendation: "Monitor diet and check for increased bile pigments."
    });
  } else if (color === "yellow") {
    insights.push({
      title: "Yellow Stool",
      description: "Yellow stool may indicate a diet high in fat or issues with fat digestion.",
      severity: "medium", // Yellow - monitor situation
      recommendation: "Check for dietary changes or consider digestive enzyme supplements."
    });
  } else if (color === "red") {
    insights.push({
      title: "Red Stool",
      description: "Red stool may indicate bleeding in the lower digestive tract.",
      severity: "high", // Red - vet attention needed
      recommendation: "Consult a veterinarian promptly to check for intestinal issues."
    });
  } else if (color === "black") {
    insights.push({
      title: "Black Stool",
      description: "Black stool may indicate bleeding in the upper digestive tract.",
      severity: "high", // Red - vet attention needed
      recommendation: "Seek veterinary care immediately to rule out serious conditions."
    });
  } else if (color === "white") {
    insights.push({
      title: "White or Gray Stool",
      description: "White or gray stool may indicate bile duct obstruction or liver issues.",
      severity: "high", // Red - vet attention needed
      recommendation: "Consult with a veterinarian as soon as possible."
    });
  }
}

// Helper function to add consistency-based insights
function addConsistencyBasedInsights(insights: HealthInsight[], consistency: PoopConsistency): void {
  if (consistency === "normal") {
    insights.push({
      title: "Normal Consistency",
      description: "Stool is well-formed and indicates normal digestion.",
      severity: "low", // Green - normal/healthy
    });
  } else if (consistency === "soft") {
    insights.push({
      title: "Soft Stool",
      description: "Soft stool may indicate minor digestive upset or dietary change.",
      severity: "medium", // Yellow - monitor situation
      recommendation: "Monitor for changes and ensure adequate hydration."
    });
  } else if (consistency === "liquid") {
    insights.push({
      title: "Liquid Stool",
      description: "Liquid stool indicates diarrhea which may be caused by infection, dietary indiscretion, or stress.",
      severity: "high", // Red - potential vet visit needed
      recommendation: "Ensure hydration and consult a veterinarian if it persists more than 24 hours."
    });
  } else if (consistency === "solid") {
    insights.push({
      title: "Hard Stool",
      description: "Hard stool may indicate dehydration or constipation.",
      severity: "medium", // Yellow - monitor situation
      recommendation: "Increase water intake and consider adding fiber to diet."
    });
  }
}
