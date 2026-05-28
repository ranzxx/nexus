"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const searchParams = useSearchParams();
  const documentId = searchParams.get('documentId')

  const { messages, sendMessage, status } = useChat();
  const isLoading = status === "streaming" || status === "submitted";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(
      { text: input },
      {
        body: documentId ? { documentId } : undefined,
      },
    );
    setInput("");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-65px)]">
      {documentId && (
        <div className="px-6 py-2 border-b border-border bg-muted/50">
          <p className="text-xs text-muted-foreground">
            chatting with document
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm">
              {documentId
                ? "ask anything about your document"
                : "start a conversation"}
            </p>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-muted text-foreground"
              }`}
            >
              {m.parts.map((part, i) =>
                part.type === "text" ? <span key={i}>{part.text}</span> : null,
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-xl px-4 py-2.5 text-sm text-muted-foreground">
              thinking...
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              documentId ? "ask about your document..." : "ask anything..."
            }
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? "..." : "send"}
          </Button>
        </form>
      </div>
    </div>
  );
}
