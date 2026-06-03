'use client'

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { createConversation } from "@/actions/conversation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send } from "lucide-react";
import FileUpload from "./FileUpload";
import { ChatMessage } from "./ChatMessage";

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
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId ?? null,
  );
  const [documentId, setDocumentId] = useState<string | null>(
    initialDocumentId ?? null,
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const formattedMessages = initialMessages.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    parts: [{ type: "text" as const, text: m.content }],
  }));

  const { messages, sendMessage, status } = useChat({
    id: conversationId ?? undefined,
    messages: formattedMessages,
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status]);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  return (
    <div className="flex flex-col h-full bg-background dark:bg-[#09090b] relative">
      {documentId && (
        <div className="px-6 py-2 border-b border-border dark:border-[#27272a] bg-muted/50 dark:bg-[#18181b]/50 shrink-0">
          <p className="text-xs text-muted-foreground dark:text-[#a1a1aa] font-medium tracking-wide">
            Chatting with document
          </p>
        </div>
      )}

      <ScrollArea className="flex-1 w-full">
        <div className="max-w-[800px] mx-auto w-full p-4 md:p-6 space-y-8 pb-8">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-secondary dark:bg-white/5 flex items-center justify-center border border-border/10 dark:border-white/10">
                <Bot className="w-6 h-6 text-foreground dark:text-white" />
              </div>
              <p className="text-muted-foreground dark:text-[#a1a1aa] text-sm">
                {documentId
                  ? "Ask anything about your document"
                  : "How can I help you today?"}
              </p>
            </div>
          )}

          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}

          {isLoading && (
            <div className="flex gap-4 justify-start">
              <Avatar className="w-8 h-8 shrink-0 mt-0.5 border border-border dark:border-[#27272a]">
                <AvatarFallback className="bg-muted dark:bg-[#18181b] text-foreground dark:text-white animate-pulse">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-muted-foreground dark:text-[#a1a1aa] py-1 text-sm flex items-center">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} className="h-1" />
        </div>
      </ScrollArea>

      <div className="w-full px-4 pb-4 pt-2 bg-background dark:bg-[#09090b] shrink-0 border-t border-border dark:border-[#27272a]">
        <div className="max-w-[800px] mx-auto w-full">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 rounded-2xl border border-border bg-transparent px-3 py-3"
          >
            {!documentId && (
              <div className="shrink-0 mb-0.5">
                <FileUpload onUploadComplete={(id) => setDocumentId(id)} />
              </div>
            )}

            <Textarea
              ref={textareaRef}
              value={input}
              data-testid="chat-input"
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={
                documentId ? "Ask about your document..." : "Message Nexus..."
              }
              disabled={isLoading}
              className="flex-1 min-h-[44px] max-h-[200px] !bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none shadow-none text-foreground text-[15px] py-3 px-1 placeholder:text-muted-foreground overflow-y-auto custom-scrollbar"
              rows={1}
            />

            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 disabled:bg-muted disabled:text-muted-foreground dark:disabled:bg-[#27272a] dark:disabled:text-[#a1a1aa] flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          <div className="text-center mt-3">
            <span className="text-[11px] text-muted-foreground/60 dark:text-[#a1a1aa]/60">
              Nexus AI can make mistakes. Consider verifying important
              information.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
