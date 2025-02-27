
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function POST(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language, error, complexity } = await req.json();
    const openAiApiKey = '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';

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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful code analysis assistant that provides clear, concise explanations and suggestions for code optimization."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return NextResponse.json(
      { analysis },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze code', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
