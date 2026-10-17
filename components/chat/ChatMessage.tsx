"use client";

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
  const textContent =
    message.content ||
    (message.parts?.map((p) => (p.type === "text" ? p.text : "")).join("") ??
      "");
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <Avatar className="mt-0.5 h-8 w-8 shrink-0 rounded-none border border-border dark:border-[#27272A]">
          <AvatarFallback className="rounded-none bg-card dark:bg-[#121212] text-foreground dark:text-[#FAFAFA]">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`flex min-w-0 max-w-[85%] flex-col gap-1.5 ${
          isUser ? "items-end" : "w-full"
        }`}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground dark:text-[#A1A1AA]">
          {isUser ? "You" : "Nexus"}
        </span>
        <div
          className={`overflow-x-hidden border text-sm leading-relaxed ${
            isUser
              ? "border-border dark:border-[#27272A] bg-muted dark:bg-[#121212] px-4 py-3 text-foreground dark:text-[#FAFAFA]"
              : "w-full border-border dark:border-[#27272A] bg-card dark:bg-[#121212] px-5 py-4 text-foreground dark:text-[#E5E1E4]"
          }`}
        >
          {isUser ? (
            <span className="whitespace-pre-wrap wrap-break-word">
              {textContent}
            </span>
          ) : (
            <MarkdownRenderer content={textContent} />
          )}
        </div>
      </div>

      {isUser && (
        <Avatar className="mt-0.5 h-8 w-8 shrink-0 rounded-none border border-border dark:border-[#27272A]">
          <AvatarFallback className="rounded-none bg-card dark:bg-[#121212] text-foreground dark:text-[#FAFAFA]">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
