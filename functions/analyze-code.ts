
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
      ? `Analyze this ${language} code that produced an error:\n\n${code}\n\nError: ${error}\n\nProvide a corrected solution and explain the fix.`
      : `Analyze this ${language} code:\n\n${code}\n\nCurrent complexity metrics:\n${JSON.stringify(complexity, null, 2)}\n\nSuggest optimizations to improve time and space complexity if possible. Provide the optimized code with explanation.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a code optimization expert. Analyze code, identify issues, and suggest improvements.'
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify({ analysis: data.choices[0].message.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to analyze code' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
