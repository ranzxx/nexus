import { createGroq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, count, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { conversation } from "@/db/schema";
import { auth } from "@/lib/auth";
import { generateQueryEmbedding, searchRelevantChunks } from "@/lib/rag";
import { saveMessage, updateConversationTitle } from "@/actions/conversation";

export const runtime = "nodejs";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

function getMessageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

async function getOrCreateConversation({
  conversationId,
  documentId,
  userId,
  isPro,
}: {
  conversationId?: string;
  documentId?: string;
  userId: string;
  isPro: boolean;
}) {
  if (conversationId) {
    const [existingConversation] = await db
      .select({ id: conversation.id })
      .from(conversation)
      .where(
        and(
          eq(conversation.id, conversationId),
          eq(conversation.userId, userId),
        ),
      )
      .limit(1);

    if (existingConversation) {
      return existingConversation.id;
    }
  }

  if (!isPro) {
    const [{ value }] = await db
      .select({ value: count() })
      .from(conversation)
      .where(eq(conversation.userId, userId));

    if (value >= 10) {
      throw new Error(
        "Free plan limit: 10 conversations. Upgrade to Pro for unlimited conversations.",
      );
    }
  }

  const [newConversation] = await db
    .insert(conversation)
    .values({
      userId,
      documentId: documentId ?? null,
      title: "New Chat",
    })
    .returning({ id: conversation.id });

  return newConversation.id;
}

export async function POST(request: Request) {
  try {
    let body: {
      messages?: UIMessage[];
      documentId?: string;
      conversationId?: string;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json("Invalid request body", { status: 400 });
    }

    const { messages, documentId, conversationId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json("Invalid messages", { status: 400 });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const userPlan = (session.user as { plan?: string }).plan;
    const isPro = userPlan === "pro";

    const model = isPro
      ? groq("llama-3.3-70b-versatile")
      : groq("llama-3.1-8b-instant");

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== "user") {
      return NextResponse.json("Invalid message", { status: 400 });
    }

    const userText = getMessageText(lastMessage);

    if (!userText.trim()) {
      return NextResponse.json("Message is empty", { status: 400 });
    }

    const currentConversationId = await getOrCreateConversation({
      conversationId,
      documentId,
      userId: session.user.id,
      isPro,
    });

    let systemPrompt = `You are a helpful assistant.${
      isPro
        ? " You are running on a premium model with enhanced capabilities."
        : ""
    }`;

    if (documentId) {
      const queryEmbedding = await generateQueryEmbedding(userText);

      const relevantChunks = await searchRelevantChunks(
        queryEmbedding,
        documentId,
      );

      systemPrompt = `You are a helpful assistant.${
        isPro
          ? " You are running on a premium model with enhanced capabilities."
          : ""
      }

Answer questions based on the following document context:

${relevantChunks.join("\n\n")}

If the answer is not in the context, say so clearly.`;
    }

    await saveMessage({
      conversationId: currentConversationId,
      role: "user",
      content: userText,
    });

    if (messages.length === 1) {
      await updateConversationTitle(
        currentConversationId,
        userText.slice(0, 50),
      );
    }

    const result = streamText({
      model,
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      onFinish: async ({ text }) => {
        await saveMessage({
          conversationId: currentConversationId,
          role: "assistant",
          content: text,
        });
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json("Failed to stream text", { status: 500 });
  }
}
