
import { PoopColor } from "@/types";

// Helper function to analyze color from image data (simulated)
export const extractColorFromImage = (imageFile: File): Promise<PoopColor> => {
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
