
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
    
    // Prepare system prompt for analyzing dog poop
    const systemPrompt = `You are a veterinary health assistant specialized in analyzing dog stool samples.
Analyze the provided dog stool image and provide insights about:
1. Color classification (brown, green, yellow, red, black, white)
2. Consistency classification (normal, soft, liquid, solid)
3. Potential health insights based on appearance
4. Clear recommendations for the dog owner (diet changes, hydration, vet visit urgency, etc.)

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
      "recommendation": "specific action recommendation"
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
              { type: 'text', text: 'Please analyze this dog stool sample and provide health insights.' },
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
        description: "There was an error analyzing this image. Please try again with a clearer photo.",
        severity: "medium",
        recommendation: "Take another photo with better lighting and focus."
      }]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
