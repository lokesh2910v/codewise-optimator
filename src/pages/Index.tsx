
import React, { useState } from 'react';
import CodeEditor from '@/components/CodeEditor';
import ResultPanel from '@/components/ResultPanel';
import { toast } from 'sonner';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({
    output: '',
    optimization: '',
    error: ''
  });

  const getLanguageVersion = (language: string) => {
    const versions: Record<string, string> = {
      'python': '3.10',
      'javascript': '18.15.0',
      'java': '15.0.2',
      'cpp': '10.2.0'
    };
    return versions[language] || '3.10';
  };

  const analyzeCode = async (code: string, language: string) => {
    setIsLoading(true);
    try {
      // Execute code with Piston API
      const executionResponse = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: language,
          version: getLanguageVersion(language),
          files: [
            {
              content: code,
            },
          ],
        }),
      });

      const executionData = await executionResponse.json();
      
      if (executionData.run.stderr) {
        // If there's an execution error, just show it without AI analysis
        setResult({
          output: '',
          error: executionData.run.stderr,
          optimization: ''
        });
      } else {
        // If code runs successfully, just show the output without AI optimization
        setResult({
          output: executionData.run.stdout,
          error: '',
          optimization: ''
        });
      }

      // Only attempt AI analysis if API key is present
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey) {
        try {
          const aiResponse = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `Analyze this ${language} code and suggest optimizations:\n${code}`
                }]
              }]
            })
          });

          const aiData = await aiResponse.json();
          if (aiData.candidates && aiData.candidates[0]) {
            setResult(prev => ({
              ...prev,
              optimization: aiData.candidates[0].content.parts[0].text
            }));
          }
        } catch (aiError) {
          console.error('AI Analysis error:', aiError);
          // Don't show AI errors to user, just silently fail AI analysis
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while analyzing the code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            Code Analyzer
          </h1>
          <p className="text-gray-400">
            Write your code, get instant analysis and optimization suggestions
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <CodeEditor onRunCode={analyzeCode} isLoading={isLoading} />
          <ResultPanel {...result} />
        </div>
      </div>
    </div>
  );
};

export default Index;
