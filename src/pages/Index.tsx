
import React, { useState } from 'react';
import CodeEditor from '@/components/CodeEditor';
import ResultPanel from '@/components/ResultPanel';
import { toast } from 'sonner';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({
    output: '',
    executionTime: '',
    spaceComplexity: '',
    timeComplexity: '',
    memoryUsed: 0,
    error: '',
    aiAnalysis: ''
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

  const analyzeComplexity = (code: string, language: string) => {
    const lines = code.split('\n');
    let maxNesting = 0;
    let currentNesting = 0;
    const loopKeywords = {
      'python': ['for', 'while'],
      'javascript': ['for', 'while', 'forEach'],
      'java': ['for', 'while', 'forEach'],
      'cpp': ['for', 'while']
    };

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (loopKeywords[language as keyof typeof loopKeywords]?.some(keyword => trimmedLine.startsWith(keyword))) {
        currentNesting++;
        maxNesting = Math.max(maxNesting, currentNesting);
      }
      if (trimmedLine.includes('}') || trimmedLine.endsWith(':')) {
        currentNesting = Math.max(0, currentNesting - 1);
      }
    }

    const complexities = {
      0: 'O(1)',
      1: 'O(n)',
      2: 'O(n²)',
      3: 'O(n³)',
    };

    return complexities[maxNesting as keyof typeof complexities] || 'O(n^k)';
  };

  const getAIAnalysis = async (code: string, language: string, error: string | null, complexity: any) => {
    try {
      console.log('Requesting AI analysis...');
      const response = await fetch('https://api-inference.huggingface.co/models/bigcode/starcoder', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: error 
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
               4. Optimized version of the code (if possible)`,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`AI Analysis failed: ${response.statusText}`);
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

      return analysis;
    } catch (error) {
      console.error('AI Analysis error:', error);
      return 'AI analysis unavailable at the moment. Please try again later.';
    }
  };

  const analyzeCode = async (code: string, language: string) => {
    setIsLoading(true);
    const startTime = performance.now();

    try {
      console.log('Executing code...');
      const executionResponse = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: language,
          version: getLanguageVersion(language),
          files: [{ content: code }],
        }),
      });

      const executionData = await executionResponse.json();
      const endTime = performance.now();
      const executionTimeMs = (endTime - startTime).toFixed(2);
      const timeComplexity = analyzeComplexity(code, language);
      
      // Get AI analysis
      const aiAnalysis = await getAIAnalysis(
        code,
        language,
        executionData.run.stderr || null,
        timeComplexity
      );

      if (executionData.run.stderr) {
        setResult({
          output: '',
          error: executionData.run.stderr,
          executionTime: executionTimeMs,
          spaceComplexity: 'N/A',
          timeComplexity: 'N/A',
          memoryUsed: 0,
          aiAnalysis
        });
        toast.error('Code execution failed');
      } else {
        setResult({
          output: executionData.run.stdout,
          error: '',
          executionTime: executionTimeMs,
          spaceComplexity: 'O(n)', // Basic estimation
          timeComplexity,
          memoryUsed: executionData.run.memory / 1024, // Convert to KB
          aiAnalysis
        });
        toast.success('Code executed successfully');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while analyzing the code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#121212] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#6E59A5]">
            Code Analyzer
          </h1>
          <p className="text-[#8E9196]">
            Write your code, get instant analysis with complexity metrics and AI optimization suggestions
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
