"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useMemo } from "react";
import { createConversation } from "@/actions/conversation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, FileText } from "lucide-react";
import FileUpload from "./FileUpload";
import { ChatMessage } from "./ChatMessage";
import { useRouter } from "next/navigation";

type DBMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  conversationId: string;
};

type UploadedDoc = {
  id: string;
  name: string;
};

type Props = {
  conversationId?: string;
  initialMessages?: DBMessage[];
  initialDocuments?: UploadedDoc[];
};

export default function ChatInterface({
  conversationId: initialConversationId,
  initialMessages = [],
  initialDocuments = [],
}: Props) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId ?? null,
  );
  const [uploadedDocs, setUploadedDocs] =
    useState<UploadedDoc[]>(initialDocuments);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasNavigated = useRef(false);

  const stableTransport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const {
    messages: chatMessages,
    sendMessage,
    status,
  } = useChat({
    transport: stableTransport,
  });

  const isLoading = status === "streaming" || status === "submitted";

  const normalizedInitialMessages = useMemo(
    () =>
      initialMessages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        parts: [{ type: "text" as const, text: m.content }],
        content: m.content,
      })),
    [initialMessages],
  );

  const displayMessages = useMemo(() => {
    if (chatMessages.length === 0) return normalizedInitialMessages;

    const chatIds = new Set(chatMessages.map((m) => m.id));
    const uniqueInitial = normalizedInitialMessages.filter(
      (m) => !chatIds.has(m.id),
    );
    return [...uniqueInitial, ...chatMessages];
  }, [normalizedInitialMessages, chatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayMessages, status]);

  useEffect(() => {
    if (
      status === "ready" &&
      conversationId &&
      !hasNavigated.current &&
      !initialConversationId &&
      chatMessages.length > 0
    ) {
      hasNavigated.current = true;
      router.push(`/chat/${conversationId}`);
    }
  }, [
    status,
    conversationId,
    initialConversationId,
    chatMessages.length,
    router,
  ]);

  async function ensureConversation(): Promise<string> {
    if (conversationId) return conversationId;

    const conv = await createConversation();
    setConversationId(conv.id);
    return conv.id;
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    let currentConversationId: string;
    try {
      currentConversationId = await ensureConversation();
    } catch (err) {
      return err;
    }

    sendMessage(
      { text },
      {
        body: {
          conversationId: currentConversationId,
        },
      },
    );
  }

  return (
    <div className="flex flex-col h-full bg-background dark:bg-[#09090b] relative overflow-hidden">
      {uploadedDocs.length > 0 && (
        <div className="px-6 py-2 border-b border-border dark:border-[#27272a] bg-muted/50 dark:bg-[#18181b]/50 shrink-0 flex items-center gap-2 flex-wrap">
          {uploadedDocs.map((doc) => (
            <span
              key={doc.id}
              className="text-xs text-muted-foreground dark:text-[#a1a1aa] font-medium tracking-wide flex items-center gap-1 bg-background dark:bg-[#27272a] px-2 py-1 rounded-md"
            >
              <FileText className="w-3 h-3" />
              {doc.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-200 mx-auto w-full p-4 md:p-6 space-y-8 pb-8">
          {displayMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-secondary dark:bg-white/5 flex items-center justify-center border border-border/10 dark:border-white/10">
                <Bot className="w-6 h-6 text-foreground dark:text-white" />
              </div>
              <p className="text-muted-foreground dark:text-[#a1a1aa] text-sm">
                {uploadedDocs.length > 0
                  ? "Ask anything about your documents"
                  : "How can I help you today?"}
              </p>
            </div>
          )}

          {displayMessages.map((m, index) => (
            <ChatMessage key={`${m.id}-${index}`} message={m} />
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
      </div>

      <div className="w-full px-4 pb-4 pt-2 bg-background dark:bg-[#09090b] shrink-0 border-t border-border dark:border-[#27272a]">
        <div className="max-w-200 mx-auto w-full">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 rounded-2xl border border-border bg-transparent px-3 py-3"
          >
            <div className="shrink-0 mb-0.5">
              <FileUpload
                getConversationId={ensureConversation}
                onUploadComplete={(id, name) => {
                  setUploadedDocs((prev) => [...prev, { id, name }]);
                }}
              />
            </div>

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
                uploadedDocs.length > 0
                  ? "Ask about your documents..."
                  : "Message Nexus..."
              }
              disabled={isLoading}
              className="flex-1 min-h-11 max-h-11 bg-transparent! border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none shadow-none text-foreground text-[15px] py-3 px-1 placeholder:text-muted-foreground overflow-y-auto custom-scrollbar"
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
