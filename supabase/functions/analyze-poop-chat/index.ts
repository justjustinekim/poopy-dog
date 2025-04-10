
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
    // Log API key status (masked for security)
    console.log('OpenAI API Key status check in analyze-poop-chat:');
    console.log('API Key exists:', !!openAIApiKey);
    console.log('API Key first 5 chars:', openAIApiKey ? openAIApiKey.substring(0, 5) + '...' : 'none');
    console.log('API Key length:', openAIApiKey ? openAIApiKey.length : 0);
    
    const requestData = await req.json();
    const { message, imageBase64, dogInfo, conversation } = requestData;
    
    console.log("Received chat request with keys:", Object.keys(requestData));
    console.log("Has image:", !!imageBase64);
    console.log("Has dog info:", !!dogInfo);
    console.log("Has conversation history:", !!conversation && Array.isArray(conversation));
    
    // Prepare system prompt for dog health assistant
    const systemPrompt = `You are a veterinary health assistant specialized in dog health with expertise in stool analysis.
Your role is to provide helpful, educational information about dog health based on poop appearance and other symptoms.
Be friendly, precise, and empathetic. Provide insights based on veterinary science about what symptoms might indicate.

Important guidelines:
1. When appropriate, remind users that a veterinarian should be consulted for proper diagnosis.
2. For concerning symptoms (blood in stool, prolonged diarrhea, lethargy), recommend veterinary care.
3. Provide practical recommendations for diet, hydration, and preventative care.
4. If you don't know something or it's outside your expertise, say so rather than guessing.
5. Keep your answers concise but informative and focused on the dog's health.

${dogInfo ? `Information about the dog: ${JSON.stringify(dogInfo)}` : ''}`;

    // Construct the messages array
    let messages = [
      { role: 'system', content: systemPrompt },
    ];
    
    // Add conversation history
    if (conversation && Array.isArray(conversation)) {
      messages = [...messages, ...conversation];
    }
    
    // Add the current message from the user
    messages.push({ 
      role: 'user', 
      content: message 
    });
    
    // Add image if available
    if (imageBase64) {
      // Format the image data
      const formattedImageData = imageBase64.startsWith('data:image/') 
        ? imageBase64 
        : `data:image/jpeg;base64,${imageBase64}`;
        
      console.log("Image data starts with:", formattedImageData.substring(0, 30) + "...");
      
      // Find the last user message to add the image
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'user') {
          messages[i] = {
            role: 'user',
            content: [
              { type: 'text', text: typeof messages[i].content === 'string' ? messages[i].content : "Analyze this dog poop image" },
              { 
                type: 'image_url', 
                image_url: {
                  url: formattedImageData
                }
              }
            ]
          };
          break;
        }
      }
    }

    // Call OpenAI API
    console.log('Calling OpenAI API...');
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log("OpenAI response received");
      
      return new Response(JSON.stringify({ 
        response: data.choices[0].message.content
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (openAIError) {
      console.error('Error calling OpenAI API:', openAIError);
      return new Response(JSON.stringify({ 
        error: `Error calling OpenAI API: ${openAIError.message}`,
        response: "I'm having trouble analyzing this right now. Please try again later."
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm sorry, but I encountered an error while processing your request. Please try again later."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
