
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, dogInfo } = await req.json();
    
    if (!imageBase64) {
      throw new Error('No image provided');
    }

    console.log("Received image for analysis");
    console.log("Using OpenAI API key:", openAIApiKey ? "Key exists" : "Key missing");
    
    // Prepare system prompt for analyzing dog poop with better vet recommendation guidance
    const systemPrompt = `You are a veterinary health assistant specialized in analyzing dog stool samples.
You are ONLY analyzing dog stool (poop) images - if the image doesn't clearly show dog stool, indicate this clearly.

Analyze the provided dog stool image and provide insights about:
1. Color classification (brown, green, yellow, red, black, white)
2. Consistency classification (normal, soft, liquid, solid)
3. Potential health insights based on appearance
4. Clear recommendations for the dog owner (diet changes, hydration, vet visit urgency, etc.)

ALWAYS recommend a vet visit for:
- Black stool (may indicate internal bleeding)
- Red or bloody stool (indicates bleeding)
- Persistent diarrhea (liquid) or severe constipation (very hard)
- White/gray/yellow stool with greasy appearance (potential bile/liver issues)
- Green stool (may indicate gall bladder issues, infection, or eating toxins)
- Any foreign objects visible in the stool

${dogInfo ? `Consider this dog information in your analysis: ${JSON.stringify(dogInfo)}` : ''}

Format your response as a JSON object with these fields:
{
  "color": "one of: brown, green, yellow, red, black, white",
  "consistency": "one of: normal, soft, liquid, solid",
  "confidence": a number between 0 and 1,
  "insights": [
    {
      "title": "brief insight title",
      "description": "detailed explanation",
      "severity": "one of: low, medium, high",
      "recommendation": "specific action recommendation - recommend a vet visit for concerning issues"
    }
  ]
}`;

    // Call OpenAI API with the image
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: 'Please analyze this dog stool sample and provide health insights. Be very accurate about whether this is actually a dog stool sample.' },
              { 
                type: 'image_url', 
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("OpenAI response received");
    
    // Parse the content as JSON
    const analysisResult = JSON.parse(data.choices[0].message.content);
    
    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error analyzing poop image:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      isPoop: false,
      insights: [{
        title: "Analysis Error",
        description: "There was an error analyzing this image. Please try again with a clearer photo of your dog's stool.",
        severity: "medium",
        recommendation: "Take another photo with better lighting and focus, ensuring the stool sample is clearly visible."
      }]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
