'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '../ui/button';

interface CodeBlockProps {
  language: string;
  value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-border dark:border-[#27272a] bg-card dark:bg-[#0e0e10]">
      <div className="flex items-center justify-between px-4 py-2 bg-muted dark:bg-[#18181b] border-b border-border dark:border-[#27272a]">
        <span className="text-xs font-mono text-muted-foreground dark:text-[#a1a1aa]">{language || 'text'}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          className="h-6 w-6 p-0 text-muted-foreground dark:text-[#a1a1aa] hover:text-foreground dark:hover:text-white"
        >
          {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <div className="p-4 overflow-x-auto custom-scrollbar">
        <pre className="text-[13px] leading-relaxed font-mono text-foreground dark:text-[#e5e1e4]">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}
