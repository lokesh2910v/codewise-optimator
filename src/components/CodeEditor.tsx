
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CodeEditorProps {
  onRunCode: (code: string, language: string) => void;
  isLoading: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onRunCode, isLoading }) => {
  const [code, setCode] = useState('// Write your code here...');
  const [language, setLanguage] = useState('python');

  const languages = [
    { value: 'python', label: 'Python', version: '3.10' },
    { value: 'javascript', label: 'JavaScript', version: '18.15.0' },
    { value: 'java', label: 'Java', version: '15.0.2' },
    { value: 'cpp', label: 'C++', version: '10.2.0' },
  ];

  return (
    <Card className="w-full h-[500px] bg-[#1A1F2C]/80 backdrop-blur-sm rounded-lg overflow-hidden border border-[#403E43]">
      <div className="flex flex-row justify-between items-center p-4 border-b border-[#403E43] gap-4">
        <div className="flex flex-row items-center gap-4">
          <span className="text-white font-mono font-semibold">Code Editor</span>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px] bg-[#2A2F3C] border-[#403E43] text-white">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-[#2A2F3C] border-[#403E43]">
              {languages.map((lang) => (
                <SelectItem 
                  key={lang.value} 
                  value={lang.value}
                  className="text-white hover:bg-[#403E43]"
                >
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={() => onRunCode(code, language)}
          disabled={isLoading}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyze
            </>
          ) : (
            'Run Code'
          )}
        </Button>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-[calc(100%-72px)] bg-[#1A1F2C] text-white p-4 font-mono text-sm resize-none focus:outline-none"
        spellCheck="false"
      />
    </Card>
  );
};

export default CodeEditor;
