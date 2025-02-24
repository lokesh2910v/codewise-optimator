
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
    <Card className="w-full h-[500px] bg-editor-bg rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-2 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <span className="text-editor-text font-mono">Code Editor</span>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {languages.map((lang) => (
                <SelectItem 
                  key={lang.value} 
                  value={lang.value}
                  className="text-white hover:bg-gray-700"
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
