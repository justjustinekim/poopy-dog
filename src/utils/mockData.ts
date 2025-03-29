
import { Dog, PoopEntry, HealthInsight } from "../types";

// Create sample dogs
export const sampleDogs: Dog[] = [
  {
    id: "dog-1",
    name: "Max",
    breed: "Golden Retriever",
    age: 3,
    weight: 65,
    imageUrl: "https://images.unsplash.com/photo-1596491219840-6fecd6a11a6f?auto=format&fit=crop&w=500&h=500"
  },
  {
    id: "dog-2",
    name: "Bella",
    breed: "Labrador",
    age: 2,
    weight: 55,
    imageUrl: "https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?auto=format&fit=crop&w=500&h=500"
  }
];

// Helper function to generate a random past date within the last 14 days
const randomPastDate = () => {
  const days = Math.floor(Math.random() * 14);
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// Create sample poop entries
export const samplePoopEntries: PoopEntry[] = [
  {
    id: "poop-1",
    dogId: "dog-1",
    date: randomPastDate(),
    imageUrl: "https://images.unsplash.com/photo-1537815749002-de6a533c64db?auto=format&fit=crop&w=500&h=500", // placeholder nature image
    consistency: "normal",
    color: "brown",
    notes: "Normal poop after morning walk",
    tags: ["morning", "after-walk"],
    location: "Park"
  },
  {
    id: "poop-2",
    dogId: "dog-1",
    date: randomPastDate(),
    imageUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=500&h=500", // placeholder nature image
    consistency: "soft",
    color: "brown",
    notes: "Slightly soft after new treats",
    tags: ["afternoon", "new-food"],
    location: "Backyard"
  },
  {
    id: "poop-3",
    dogId: "dog-2",
    date: randomPastDate(),
    imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=500&h=500", // placeholder nature image
    consistency: "normal",
    color: "brown",
    notes: "Normal evening poop",
    tags: ["evening", "normal"],
    location: "Neighborhood"
  },
  {
    id: "poop-4",
    dogId: "dog-2",
    date: randomPastDate(),
    imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&h=500", // placeholder nature image
    consistency: "liquid",
    color: "brown",
    notes: "Loose stool, might be from the new chew toy",
    tags: ["morning", "concern"],
    location: "Home"
  }
];

// Create sample health insights
export const sampleHealthInsights: HealthInsight[] = [
  {
    title: "Healthy Digestion",
    description: "Max has shown consistent, healthy stool patterns over the past week.",
    severity: "low",
    recommendation: "Continue with current diet and exercise routine."
  },
  {
    title: "Slight Digestive Upset",
    description: "Bella had one episode of loose stool possibly related to a dietary change.",
    severity: "medium",
    recommendation: "Monitor closely and consider reverting to previous food if symptoms persist."
  }
];

// Function to generate mock health insights
export const generateMockHealthInsights = (count: number = 3): HealthInsight[] => {
  const insights: HealthInsight[] = [];
  
  const titles = [
    "Digestive Health",
    "Diet Assessment",
    "Hydration Levels",
    "Fiber Content",
    "Possible Food Sensitivity",
    "Stool Consistency Trend"
  ];
  
  const descriptions = [
    "Based on recent samples, your dog's digestive system appears to be functioning normally.",
    "Recent stool samples suggest a well-balanced diet with good nutrient absorption.",
    "Stool consistency indicates proper hydration levels.",
    "Fiber content appears to be within the normal range for a healthy dog.",
    "Minor variations in stool consistency may indicate a mild food sensitivity.",
    "Recent samples show consistent and healthy stool patterns."
  ];
  
  const recommendations = [
    "Continue with current diet and exercise routine.",
    "Maintain current feeding schedule and portion sizes.",
    "Ensure fresh water is always available.",
    "Consider adding a small amount of pumpkin to their diet for added fiber.",
    "Monitor for any changes after meals with specific ingredients.",
    "No changes needed to current care routine."
  ];
  
  const severities: Array<"low" | "medium" | "high"> = ["low", "medium", "high"];
  
  for (let i = 0; i < count; i++) {
    const titleIndex = Math.floor(Math.random() * titles.length);
    const descIndex = Math.floor(Math.random() * descriptions.length);
    const recIndex = Math.floor(Math.random() * recommendations.length);
    const sevIndex = Math.floor(Math.random() * severities.length);
    
    insights.push({
      title: titles[titleIndex],
      description: descriptions[descIndex],
      severity: severities[sevIndex],
      recommendation: recommendations[recIndex]
    });
  }
  
  return insights;
};

// Get entries for a specific dog
export const getEntriesForDog = (dogId: string): PoopEntry[] => {
  return samplePoopEntries.filter(entry => entry.dogId === dogId);
};

// Get insights for a specific dog
export const getInsightsForDog = (dogId: string): HealthInsight[] => {
  // In a real app, this would analyze actual poop data
  return sampleHealthInsights.filter((_, index) => {
    return dogId === sampleDogs[index % sampleDogs.length].id;
  });
};

// Get all entries for the last N days
export const getRecentEntries = (days: number = 7): PoopEntry[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return samplePoopEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= cutoffDate;
  });
};
