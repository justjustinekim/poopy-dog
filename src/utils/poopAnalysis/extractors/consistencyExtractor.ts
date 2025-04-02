
import { PoopConsistency } from "@/types";

// Helper function to analyze consistency from image (simulated)
export const extractConsistencyFromImage = (imageFile: File): Promise<PoopConsistency> => {
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
