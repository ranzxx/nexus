"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface CodeBlockProps {
  language: string;
  value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <div className="my-4 overflow-hidden border border-border bg-card dark:border-[#27272A] dark:bg-[#0E0E10]">
      <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2 dark:border-[#27272A] dark:bg-[#18181B]">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground dark:text-[#A1A1AA]">
          {language || "text"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          aria-label={isCopied ? "Copied" : "Copy code"}
          className="h-6 w-6 rounded-none p-0 text-muted-foreground hover:text-foreground dark:text-[#A1A1AA] dark:hover:text-white"
        >
          {isCopied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <div className="custom-scrollbar overflow-x-auto p-4">
        <pre className="font-mono text-[13px] leading-relaxed text-foreground dark:text-[#E5E1E4]">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}
