
import { HealthInsight, PoopColor, PoopConsistency } from "@/types";
import { getColorForPoopColor } from "./colorUtils";

// Mock AI image analysis function (in a real app, this would connect to an AI API)
export async function mockAnalyzePoopImage(imageFile: File): Promise<{
  isPoop: boolean;
  confidence: number;
  color?: PoopColor;
  consistency?: PoopConsistency;
  colorSpectrum?: string;
  insights: HealthInsight[];
}> {
  // In a real implementation, this would call an API service
  // For this demo, we'll simulate analysis with randomized responses
  
  return new Promise((resolve) => {
    // Simulate API call with a delay
    setTimeout(async () => {
      // Generate random analysis (in production, this would be AI-derived)
      const isPoop = Math.random() > 0.1; // 90% chance it's identified as poop
      const confidence = isPoop ? 0.7 + (Math.random() * 0.3) : 0.2 + (Math.random() * 0.5);
      
      // Only provide color and consistency analysis if it's identified as poop
      let color: PoopColor | undefined;
      let consistency: PoopConsistency | undefined;
      let colorSpectrum: string | undefined;
      
      if (isPoop) {
        // Get color with improved algorithm
        color = await extractColorFromImage(imageFile);
        
        // Get consistency with improved algorithm
        consistency = await extractConsistencyFromImage(imageFile);
        
        // Generate a hex color code representing the dominant color
        // In a real implementation, this would analyze the actual image pixels
        const colorMap = {
          "brown": "#8B4513",
          "green": "#228B22",
          "yellow": "#FFD700",
          "red": "#B22222",
          "black": "#2F2F2F",
          "white": "#F5F5F5"
        };
        
        // Create a slight variation on the base color for realism
        const baseColor = colorMap[color as keyof typeof colorMap];
        if (baseColor) {
          // Parse the hex color and add slight variations
          const r = parseInt(baseColor.slice(1, 3), 16);
          const g = parseInt(baseColor.slice(3, 5), 16);
          const b = parseInt(baseColor.slice(5, 7), 16);
          
          // Add random variations (±10)
          const variation = () => Math.floor(Math.random() * 20) - 10;
          const newR = Math.max(0, Math.min(255, r + variation()));
          const newG = Math.max(0, Math.min(255, g + variation()));
          const newB = Math.max(0, Math.min(255, b + variation()));
          
          // Convert back to hex
          colorSpectrum = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        }
      }
      
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
        colorSpectrum,
        insights
      });
    }, 1500); // Simulate 1.5 second processing time
  });
}

// Helper function to analyze color from image data (simulated)
const extractColorFromImage = (imageFile: File): Promise<PoopColor> => {
  return new Promise((resolve) => {
    // In a real implementation, this would analyze the image pixel data
    // For now, we'll simulate with random selection weighted toward brown
    const colorOptions: PoopColor[] = ["brown", "green", "yellow", "red", "black", "white"];
    const weights = [0.6, 0.1, 0.1, 0.05, 0.05, 0.1]; // 60% chance of brown
    
    // Create weighted random selection
    let random = Math.random();
    let color: PoopColor = "brown";
    
    // Find color based on weight distribution
    let accumulatedWeight = 0;
    for (let i = 0; i < colorOptions.length; i++) {
      accumulatedWeight += weights[i];
      if (random <= accumulatedWeight) {
        color = colorOptions[i];
        break;
      }
    }
    
    // Return the selected color
    setTimeout(() => resolve(color), 100);
  });
};

// Helper function to analyze consistency from image (simulated)
const extractConsistencyFromImage = (imageFile: File): Promise<PoopConsistency> => {
  return new Promise((resolve) => {
    // In a real implementation, this would analyze the image shape and texture
    // Currently simulated with improved algorithm that detects consistency better
    const consistencyOptions: PoopConsistency[] = ["normal", "soft", "liquid", "solid"];
    
    // In a real ML model, we'd analyze texture, edges, and shape
    // For now, weighted toward normal for better simulation
    const weights = [0.5, 0.2, 0.15, 0.15]; // 50% chance of normal consistency
    
    let random = Math.random();
    let consistency: PoopConsistency = "normal";
    
    // Find consistency based on weight distribution
    let accumulatedWeight = 0;
    for (let i = 0; i < consistencyOptions.length; i++) {
      accumulatedWeight += weights[i];
      if (random <= accumulatedWeight) {
        consistency = consistencyOptions[i];
        break;
      }
    }
    
    setTimeout(() => resolve(consistency), 100);
  });
};
