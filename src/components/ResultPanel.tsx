
import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Infinity, ChartBar, HardDrive, Cpu } from 'lucide-react';

interface ResultPanelProps {
  output: string;
  executionTime?: string;
  spaceComplexity?: string;
  timeComplexity?: string;
  memoryUsed?: number;
  error?: string;
  aiAnalysis?: string;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ 
  output, 
  executionTime, 
  spaceComplexity, 
  timeComplexity,
  memoryUsed,
  error,
  aiAnalysis
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

        {aiAnalysis && (
          <div className="text-purple-400 font-mono mb-6 p-4 bg-purple-500/10 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">AI Analysis:</h3>
            <pre className="whitespace-pre-wrap">{aiAnalysis}</pre>
          </div>
        )}

        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#2A2F3C] rounded-lg transition-all hover:bg-[#323846]">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-[#9b87f5]" />
                <h3 className="text-sm font-semibold text-[#9b87f5]">Execution Time</h3>
              </div>
              <p className="text-white font-mono">{executionTime || '0'}ms</p>
            </div>
            
            <div className="p-4 bg-[#2A2F3C] rounded-lg transition-all hover:bg-[#323846]">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-5 h-5 text-[#9b87f5]" />
                <h3 className="text-sm font-semibold text-[#9b87f5]">Space Consumed</h3>
              </div>
              <p className="text-white font-mono">{memoryUsed ? `${memoryUsed.toFixed(2)} KB` : 'N/A'}</p>
            </div>
            
            <div className="p-4 bg-[#2A2F3C] rounded-lg transition-all hover:bg-[#323846]">
              <div className="flex items-center gap-2 mb-2">
                <ChartBar className="w-5 h-5 text-[#9b87f5]" />
                <h3 className="text-sm font-semibold text-[#9b87f5]">Space Complexity</h3>
              </div>
              <p className="text-white font-mono">{spaceComplexity || 'N/A'}</p>
            </div>
            
            <div className="p-4 bg-[#2A2F3C] rounded-lg transition-all hover:bg-[#323846]">
              <div className="flex items-center gap-2 mb-2">
                <Infinity className="w-5 h-5 text-[#9b87f5]" />
                <h3 className="text-sm font-semibold text-[#9b87f5]">Time Complexity</h3>
              </div>
              <p className="text-white font-mono">{timeComplexity || 'N/A'}</p>
            </div>
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default ResultPanel;
