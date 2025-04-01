
import { PoopColor } from "@/types";

// Helper function to get color hex based on poop color
export function getColorForPoopColor(color?: PoopColor): string | undefined {
  if (!color) return undefined;
  
  const colorMap: Record<PoopColor, string> = {
    "brown": "#8B4513",
    "green": "#228B22",
    "yellow": "#FFD700",
    "red": "#B22222",
    "black": "#2F2F2F",
    "white": "#F5F5F5",
    "other": "#A9A9A9" // Default to grey for "other" color
  };
  
  return colorMap[color];
}
