'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";

type Message = {
  id: string;
  role: "user" | "assistant" | "system" | "data";
  content?: string;
  parts?: Array<{
    type: string;
    text?: string;
    [key: string]: unknown;
  }>;
};

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const textContent = message.content || (message.parts?.map(p => p.type === 'text' ? p.text : '').join('') ?? "");

  return (
    <div className={`flex gap-4 w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      {message.role !== "user" && (
        <Avatar className="w-8 h-8 shrink-0 mt-0.5 border border-border dark:border-[#27272a]">
          <AvatarFallback className="bg-muted dark:bg-[#18181b] text-foreground dark:text-white">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={`max-w-[85%] text-sm leading-relaxed overflow-x-hidden ${
          message.role === "user"
            ? "bg-muted dark:bg-[#18181b] text-foreground dark:text-white rounded-2xl rounded-tr-sm px-5 py-3 border border-border/50 dark:border-[#27272a]/50"
            : "text-foreground dark:text-[#e5e1e4] py-1 w-full"
        }`}
      >
        {message.role === "user" ? (
          <span className="whitespace-pre-wrap wrap-break-word">{textContent}</span>
        ) : (
          <MarkdownRenderer content={textContent} />
        )}
      </div>
      
      {message.role === "user" && (
        <Avatar className="w-8 h-8 shrink-0 mt-0.5 border border-border dark:border-[#27272a]">
          <AvatarFallback className="bg-muted dark:bg-[#18181b] text-foreground dark:text-white">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
