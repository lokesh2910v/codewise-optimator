
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const starcoderApiKey = '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';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language, error, complexity } = await req.json();

    let prompt = error 
      ? `Analysis of the following ${language} code that produced an error:
         Code:
         ${code}
         
         Error:
         ${error}
         
         Please provide:
         1. Error explanation
         2. How to fix the code
         3. Corrected version of the code`
      : `Analysis of the following ${language} code:
         Code:
         ${code}
         
         Current complexity metrics:
         ${JSON.stringify(complexity, null, 2)}
         
         Please provide:
         1. Code explanation
         2. Optimal solution approach
         3. Time and space complexity analysis
         4. Optimized version of the code (if possible)`;

    const response = await fetch('https://api-inference.huggingface.co/models/bigcode/starcoder', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${starcoderApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`StarCoder API error: ${response.statusText}`);
    }

    const data = await response.json();
    let analysis = data[0].generated_text;

    // Clean up the response
    analysis = analysis.trim();
    if (analysis.startsWith('"')) {
      analysis = analysis.slice(1);
    }
    if (analysis.endsWith('"')) {
      analysis = analysis.slice(0, -1);
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(JSON.stringify({ error: 'Failed to analyze code', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
