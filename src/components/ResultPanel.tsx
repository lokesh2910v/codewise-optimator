
import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResultPanelProps {
  output: string;
  optimization?: string;
  error?: string;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ output, optimization, error }) => {
  return (
    <Card className="w-full h-[500px] bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden animate-fadeIn">
      <div className="p-2 border-b border-gray-700">
        <span className="text-white font-mono">Results</span>
      </div>
      <ScrollArea className="h-[calc(100%-48px)] p-4">
        {error ? (
          <div className="text-red-400 font-mono mb-4">
            <h3 className="text-lg font-semibold mb-2">Error:</h3>
            <pre className="whitespace-pre-wrap">{error}</pre>
          </div>
        ) : null}
        
        {output && (
          <div className="text-emerald-400 font-mono mb-4">
            <h3 className="text-lg font-semibold mb-2">Output:</h3>
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        )}

        {optimization && (
          <div className="text-blue-400 font-mono">
            <h3 className="text-lg font-semibold mb-2">Optimization Suggestions:</h3>
            <pre className="whitespace-pre-wrap">{optimization}</pre>
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default ResultPanel;
