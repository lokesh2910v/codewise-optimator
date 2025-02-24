
import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Infinity, ChartBar } from 'lucide-react';

interface ResultPanelProps {
  output: string;
  executionTime?: string;
  spaceComplexity?: string;
  timeComplexity?: string;
  error?: string;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ 
  output, 
  executionTime, 
  spaceComplexity, 
  timeComplexity, 
  error 
}) => {
  return (
    <Card className="w-full h-[500px] bg-[#1A1F2C]/80 backdrop-blur-sm rounded-lg overflow-hidden animate-fadeIn border border-[#403E43]">
      <div className="p-4 border-b border-[#403E43]">
        <span className="text-white font-mono font-semibold">Results</span>
      </div>
      <ScrollArea className="h-[calc(100%-64px)] p-4">
        {error ? (
          <div className="text-red-400 font-mono mb-6 p-4 bg-red-500/10 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Error:</h3>
            <pre className="whitespace-pre-wrap">{error}</pre>
          </div>
        ) : null}
        
        {output && (
          <div className="text-emerald-400 font-mono mb-6 p-4 bg-emerald-500/10 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Output:</h3>
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        )}

        {!error && executionTime && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-[#2A2F3C] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#9b87f5]" />
                <h3 className="text-sm font-semibold text-[#9b87f5]">Execution Time</h3>
              </div>
              <p className="text-white font-mono">{executionTime}ms</p>
            </div>
            
            <div className="p-4 bg-[#2A2F3C] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ChartBar className="w-4 h-4 text-[#7E69AB]" />
                <h3 className="text-sm font-semibold text-[#7E69AB]">Space Complexity</h3>
              </div>
              <p className="text-white font-mono">{spaceComplexity}</p>
            </div>
            
            <div className="p-4 bg-[#2A2F3C] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Infinity className="w-4 h-4 text-[#6E59A5]" />
                <h3 className="text-sm font-semibold text-[#6E59A5]">Time Complexity</h3>
              </div>
              <p className="text-white font-mono">{timeComplexity}</p>
            </div>
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default ResultPanel;
