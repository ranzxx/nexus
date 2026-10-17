"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useMemo } from "react";
import { createConversation } from "@/actions/conversation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, FileText, Loader2 } from "lucide-react";
import FileUpload from "./FileUpload";
import { ChatMessage } from "./ChatMessage";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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

  const trpc = useTRPC();
  const { data: allDocs } = useQuery({
    ...trpc.document.list.queryOptions(),
    enabled: uploadedDocs.length > 0,
    refetchInterval: (query) => {
      const rows = query.state.data;
      const pending = uploadedDocs.some((d) => {
        const s = rows?.find((r) => r.id === d.id)?.status;
        return s !== "ready" && s !== "failed";
      });
      return pending ? 3000 : false; 
    },
  });
  const statusOf = (id: string) => allDocs?.find((d) => d.id === id)?.status;

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
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

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

    let currentConversationId: string;
    try {
      currentConversationId = await ensureConversation();
    } catch (err) {
      setInput(text);
      toast.error(
        err instanceof Error ? err.message : "Failed to start conversation",
      );
      return;
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
      <div className="flex flex-col h-full bg-background dark:bg-[#0A0A0A] relative overflow-hidden">
        {uploadedDocs.length > 0 && (
          <div className="px-6 py-3 border-b border-border dark:border-[#27272A] shrink-0 flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground dark:text-[#A1A1AA] mr-1">
              Docs
            </span>
            {uploadedDocs.map((doc) => (
              <span
                key={doc.id}
                className="font-mono text-xs text-foreground dark:text-[#FAFAFA] flex items-center gap-2 border border-border dark:border-[#27272A] bg-card dark:bg-[#121212] px-2.5 py-1"
              >
                <FileText className="w-3 h-3 text-muted-foreground dark:text-[#A1A1AA]" />
                {doc.name}
                {statusOf(doc.id) === "failed" ? (
                  <span className="text-destructive">failed</span>
                ) : statusOf(doc.id) !== "ready" ? (
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground dark:text-[#A1A1AA]" />
                ) : null}
              </span>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto w-full">
          <div className="max-w-200 mx-auto w-full p-4 md:p-6 space-y-8 pb-8">
            {displayMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-4">
                <div className="w-12 h-12 border border-border dark:border-[#27272A] bg-card dark:bg-[#121212] flex items-center justify-center">
                  <Bot className="w-6 h-6 text-foreground dark:text-[#FAFAFA]" />
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground dark:text-[#A1A1AA]">
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
                <Avatar className="w-8 h-8 shrink-0 mt-0.5 rounded-none border border-border dark:border-[#27272A]">
                  <AvatarFallback className="rounded-none bg-card dark:bg-[#121212] text-foreground dark:text-[#FAFAFA] animate-pulse">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="py-1 flex items-center">
                  <span className="animate-pulse font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground dark:text-[#A1A1AA]">
                    Thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={scrollRef} className="h-1" />
          </div>
        </div>

        <div className="w-full px-4 pb-4 pt-3 bg-background dark:bg-[#0A0A0A] shrink-0 border-t border-border dark:border-[#27272A]">
          <div className="max-w-200 mx-auto w-full">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 border border-border dark:border-[#27272A] bg-card dark:bg-[#121212] px-3 pt-3 pb-2 transition-colors focus-within:border-foreground/60 dark:focus-within:border-[#FAFAFA]"
            >
              <Textarea
                ref={textareaRef}
                value={input}
                data-testid="chat-input"
                onChange={(e) => setInput(e.target.value)}
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
                className="w-full min-h-10 max-h-60 rounded-none bg-transparent! border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none shadow-none text-foreground text-[15px] py-2 px-1 placeholder:text-muted-foreground overflow-y-auto custom-scrollbar"
                rows={1}
              />

              <div className="flex items-center justify-between">
                <FileUpload
                  getConversationId={ensureConversation}
                  onUploadComplete={(id, name) => {
                    setUploadedDocs((prev) => [...prev, { id, name }]);
                  }}
                />

                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="h-9 w-9 shrink-0 rounded-none bg-foreground text-background hover:bg-foreground/90 dark:bg-[#EDEDED] dark:text-[#0A0A0A] dark:hover:bg-white disabled:bg-muted disabled:text-muted-foreground dark:disabled:bg-[#27272A] dark:disabled:text-[#A1A1AA] flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>

            <div className="text-center mt-3">
              <span className="font-mono text-[11px] text-muted-foreground dark:text-[#A1A1AA]">
                Nexus AI can make mistakes. Consider verifying important
                information.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
}
