
import { HealthInsight, PoopColor, PoopConsistency } from "@/types";

// Mock AI image analysis function (in a real app, this would connect to an AI API)
export async function analyzePoopImage(imageFile: File): Promise<{
  isPoop: boolean;
  confidence: number;
  color?: PoopColor;
  consistency?: PoopConsistency;
  insights: HealthInsight[];
}> {
  // In a real implementation, this would call an API service
  // For this demo, we'll simulate analysis with randomized responses
  
  return new Promise((resolve) => {
    // Simulate API call with a delay
    setTimeout(() => {
      // Generate random analysis (in production, this would be AI-derived)
      const isPoop = Math.random() > 0.1; // 90% chance it's identified as poop
      const confidence = isPoop ? 0.7 + (Math.random() * 0.3) : 0.2 + (Math.random() * 0.5);
      
      // Only provide color and consistency analysis if it's identified as poop
      const colorOptions: PoopColor[] = ["brown", "green", "yellow", "red", "black", "white"];
      const consistencyOptions: PoopConsistency[] = ["normal", "soft", "liquid", "solid"];
      
      const color = isPoop ? colorOptions[Math.floor(Math.random() * colorOptions.length)] : undefined;
      const consistency = isPoop ? consistencyOptions[Math.floor(Math.random() * consistencyOptions.length)] : undefined;
      
      // Generate insights based on color and consistency
      const insights: HealthInsight[] = [];
      
      if (isPoop) {
        // Add color-based insights
        if (color === "brown") {
          insights.push({
            title: "Normal Color",
            description: "Brown coloration indicates normal digestion.",
            severity: "low",
          });
        } else if (color === "green") {
          insights.push({
            title: "Green Stool",
            description: "Green stool may indicate food moving too quickly through the intestines or consumption of leafy greens.",
            severity: "medium",
            recommendation: "Monitor diet and check for increased bile pigments."
          });
        } else if (color === "yellow") {
          insights.push({
            title: "Yellow Stool",
            description: "Yellow stool may indicate a diet high in fat or issues with fat digestion.",
            severity: "medium",
            recommendation: "Check for dietary changes or consider digestive enzyme supplements."
          });
        } else if (color === "red") {
          insights.push({
            title: "Red Stool",
            description: "Red stool may indicate bleeding in the lower digestive tract.",
            severity: "high",
            recommendation: "Consult a veterinarian promptly to check for intestinal issues."
          });
        } else if (color === "black") {
          insights.push({
            title: "Black Stool",
            description: "Black stool may indicate bleeding in the upper digestive tract.",
            severity: "high",
            recommendation: "Seek veterinary care immediately to rule out serious conditions."
          });
        } else if (color === "white") {
          insights.push({
            title: "White or Gray Stool",
            description: "White or gray stool may indicate bile duct obstruction or liver issues.",
            severity: "high",
            recommendation: "Consult with a veterinarian as soon as possible."
          });
        }
        
        // Add consistency-based insights
        if (consistency === "normal") {
          insights.push({
            title: "Normal Consistency",
            description: "Stool is well-formed and indicates normal digestion.",
            severity: "low",
          });
        } else if (consistency === "soft") {
          insights.push({
            title: "Soft Stool",
            description: "Soft stool may indicate minor digestive upset or dietary change.",
            severity: "medium",
            recommendation: "Monitor for changes and ensure adequate hydration."
          });
        } else if (consistency === "liquid") {
          insights.push({
            title: "Liquid Stool",
            description: "Liquid stool indicates diarrhea which may be caused by infection, dietary indiscretion, or stress.",
            severity: "high",
            recommendation: "Ensure hydration and consult a veterinarian if it persists more than 24 hours."
          });
        } else if (consistency === "solid") {
          insights.push({
            title: "Hard Stool",
            description: "Hard stool may indicate dehydration or constipation.",
            severity: "medium",
            recommendation: "Increase water intake and consider adding fiber to diet."
          });
        }
      } else {
        // If not identified as poop
        insights.push({
          title: "Unidentified Sample",
          description: "The image doesn't appear to contain a stool sample, or the quality is insufficient for analysis.",
          severity: "medium",
          recommendation: "Please take another clear photo of the stool sample."
        });
      }
      
      resolve({
        isPoop,
        confidence,
        color,
        consistency,
        insights
      });
    }, 1500); // Simulate 1.5 second processing time
  });
}
