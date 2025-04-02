
import { HealthInsight, PoopColor, PoopConsistency } from "@/types";
import { getColorForPoopColor } from "./colorUtils";
import { extractColorFromImage } from "./extractors/colorExtractor";
import { extractConsistencyFromImage } from "./extractors/consistencyExtractor";
import { generateInsightsFromAnalysis } from "./insights/insightGenerator";

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
      const insights: HealthInsight[] = isPoop 
        ? generateInsightsFromAnalysis(color, consistency)
        : [{
            title: "Unidentified Sample",
            description: "The image doesn't appear to contain a stool sample, or the quality is insufficient for analysis.",
            severity: "medium" as "medium", // Fix: explicitly cast to the union type
            recommendation: "Please take another clear photo of the stool sample."
          }];
      
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
