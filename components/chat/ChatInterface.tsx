"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createConversation } from "@/actions/conversation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileUpload from "./FileUpload";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  conversationId: string;
};

type Props = {
  conversationId?: string;
  initialMessages?: Message[];
  initialDocumentId?: string;
};

export default function ChatInterface({
  conversationId: initialConversationId,
  initialMessages = [],
  initialDocumentId,
}: Props) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId ?? null,
  );
  const [documentId, setDocumentId] = useState<string | null>(
    initialDocumentId ?? null,
  );

  const formattedMessages = initialMessages.map((m) => ({
    id: m.id,
    role: m.role,
    parts: [{ type: "text" as const, text: m.content }],
  }));

  const { messages, sendMessage, status } = useChat({
    id: conversationId ?? undefined,
    messages: formattedMessages,
  });

  const isLoading = status === "streaming" || status === "submitted";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const text = input.trim();
    if (!text || isLoading) return;

    let currentConversationId = conversationId;

    if (!currentConversationId) {
      const conv = await createConversation(documentId ?? undefined);

      currentConversationId = conv.id;
      setConversationId(conv.id);

      const url = documentId
        ? `/chat/${conv.id}?documentId=${documentId}`
        : `/chat/${conv.id}`;

      window.history.replaceState(null, "", url);
    }

    sendMessage(
      { text },
      {
        body: {
          conversationId: currentConversationId,
          documentId: documentId ?? undefined,
        },
      },
    );

    setInput("");
  }

  return (
    <div className="flex flex-col h-full">
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
        <div className="max-w-3xl mx-auto space-y-2">
          {!documentId && (
            <FileUpload onUploadComplete={(id) => setDocumentId(id)} />
          )}
          <form onSubmit={handleSubmit} className="flex gap-2">
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
    </div>
  );
}
