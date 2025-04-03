
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    // Log API key status (masked for security)
    console.log('OpenAI API Key status check:');
    console.log('API Key exists:', !!openAIApiKey);
    console.log('API Key first 5 chars:', openAIApiKey ? openAIApiKey.substring(0, 5) + '...' : 'none');
    console.log('API Key length:', openAIApiKey ? openAIApiKey.length : 0);
    
    const { imageUrl, imageBase64, dogInfo } = await req.json();
    
    // Check if we have either imageUrl or imageBase64
    if (!imageUrl && !imageBase64) {
      return new Response(
        JSON.stringify({ error: 'No image URL or base64 provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Calling OpenAI API with image...');
    
    // Determine dog breed for better analysis if available
    const dogBreed = dogInfo?.breed ? `The dog is a ${dogInfo.breed}.` : '';
    const dogAge = dogInfo?.age ? `The dog is ${dogInfo.age} years old.` : '';
    const dogDiet = dogInfo?.diet_type ? `The dog's diet type is ${dogInfo.diet_type}.` : '';
    
    const dogContext = `${dogBreed} ${dogAge} ${dogDiet}`.trim();
    const systemPrompt = `You are a veterinary assistant specialized in analyzing dog poop. 
    You provide detailed health insights based on stool appearance and texture.
    ${dogContext ? 'Additional context: ' + dogContext : ''}
    
    Provide a concise summary (under 100 words) with:
    1. Overall assessment of the stool (healthy, concerning, or requires attention)
    2. Likely color and consistency classification
    3. Key observations about gut health
    4. Brief recommendation`;

    // Call OpenAI API to analyze the image
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              { 
                type: 'text', 
                text: 'Analyze this dog poop image and provide health insights about the dog\'s gut ecosystem.'
              },
              { 
                type: 'image_url', 
                image_url: { 
                  url: imageBase64 ? imageBase64 : imageUrl 
                } 
              }
            ]
          }
        ],
        max_tokens: 500
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${data.error.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const analysis = data.choices?.[0]?.message?.content || 'Unable to analyze the image.';
    console.log('Analysis result:', analysis.substring(0, 100) + '...');
    
    // Extract color and consistency information if we can
    let color = 'brown'; // Default color
    let consistency = 'normal'; // Default consistency
    
    // Simple extraction based on common keywords
    if (analysis.toLowerCase().includes('green')) color = 'green';
    else if (analysis.toLowerCase().includes('yellow')) color = 'yellow';
    else if (analysis.toLowerCase().includes('red') || analysis.toLowerCase().includes('blood')) color = 'red';
    else if (analysis.toLowerCase().includes('black')) color = 'black';
    else if (analysis.toLowerCase().includes('white')) color = 'white';
    
    if (analysis.toLowerCase().includes('soft')) consistency = 'soft';
    else if (analysis.toLowerCase().includes('liquid') || analysis.toLowerCase().includes('diarrhea')) consistency = 'liquid';
    else if (analysis.toLowerCase().includes('solid') || analysis.toLowerCase().includes('hard')) consistency = 'solid';
    
    // Generate health insights from the analysis
    const insights = [{
      title: "AI Analysis",
      description: analysis,
      severity: analysis.toLowerCase().includes('concern') ? "medium" : "low",
      recommendation: "Review the analysis and consider consulting with your vet if issues persist."
    }];

    return new Response(
      JSON.stringify({ 
        analysis,
        color,
        consistency, 
        confidence: 0.8,
        insights
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-poop function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
