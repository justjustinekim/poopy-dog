
import { HealthInsight, PoopColor, PoopConsistency } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { fileToBase64 } from "./fileUtils";
import { getColorForPoopColor } from "./colorUtils";

// Real AI image analysis function using OpenAI via Supabase Edge Function
export async function analyzePoopImage(imageFile: File, dogInfo?: any): Promise<{
  isPoop: boolean;
  confidence: number;
  color?: PoopColor;
  consistency?: PoopConsistency;
  colorSpectrum?: string;
  insights: HealthInsight[];
}> {
  try {
    console.log("Converting image to base64...");
    const imageBase64 = await fileToBase64(imageFile);
    
    console.log("Calling OpenAI analysis function...");
    // Add detailed logging
    console.log("Image base64 string length:", imageBase64.length);
    console.log("Dog info:", JSON.stringify(dogInfo));
    
    const { data, error } = await supabase.functions.invoke('analyze-poop', {
      body: { 
        imageBase64: `data:image/jpeg;base64,${imageBase64}`,
        dogInfo 
      },
    });
    
    if (error) {
      console.error("Error calling analysis function:", error);
      throw new Error(`Function error: ${error.message}`);
    }
    
    if (!data) {
      console.error("No data returned from analysis");
      throw new Error("No data returned from analysis");
    }
    
    console.log("Analysis result:", data);
    
    // Map the response to our expected format
    const result = {
      isPoop: data.error ? false : true,
      confidence: data.confidence || 0.8,
      color: data.color as PoopColor,
      consistency: data.consistency as PoopConsistency,
      colorSpectrum: getColorForPoopColor(data.color as PoopColor),
      insights: data.insights || [],
    };
    
    return result;
  } catch (error) {
    console.error("Error in analyzePoopImage:", error);
    
    // Return a fallback response
    return {
      isPoop: false,
      confidence: 0.5,
      insights: [{
        title: "Analysis Error",
        description: "There was an error analyzing this image. Please try again with a clearer photo.",
        severity: "medium",
        recommendation: "Try taking another photo with better lighting and focus."
      }]
    };
  }
}
