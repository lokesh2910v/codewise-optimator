
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CodeEditorProps {
  onRunCode: (code: string) => void;
  isLoading: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onRunCode, isLoading }) => {
  const [code, setCode] = useState('// Write your code here...');

  return (
    <Card className="w-full h-[500px] bg-editor-bg rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-2 border-b border-gray-700">
        <span className="text-editor-text font-mono">Code Editor</span>
        <Button 
          onClick={() => onRunCode(code)}
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing
            </>
          ) : (
            'Run Code'
          )}
        </Button>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-[calc(100%-48px)] bg-editor-bg text-editor-text p-4 font-mono text-sm resize-none focus:outline-none"
        spellCheck="false"
      />
    </Card>
  );
};

export default CodeEditor;
