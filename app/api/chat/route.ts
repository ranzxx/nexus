import { convertToModelMessages, streamText, UIMessage } from "ai";
import { NextResponse } from "next/server";
import { groq } from "@ai-sdk/groq";
import { generateQueryEmbedding, searchRelevantChunks } from "@/lib/rag";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { messages, documentId }: { messages: UIMessage[]; documentId: string } = await request.json();

    let systemPrompt = "You are a helpful assistant.";

    if(documentId) {
      const lastMessage = messages[messages.length - 1];

      const query = lastMessage.parts
        .filter(part => part.type === 'text')
        .map(part => part.text)
        .join('');

      const queryEmbedding = await generateQueryEmbedding(query);
      const relevantChunks = await searchRelevantChunks(
        queryEmbedding,
        documentId,
      );

      systemPrompt = `You are a helpful assistant. Answer questions based on the following document context:
        ${relevantChunks.join("\n\n")}
        If the answer is not in the context, say so clearly.`;
    }

    const result = streamText({
      model: groq('llama-3.1-8b-instant'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error(err);
    return NextResponse.json("Failed to stream text", { status: 500 });
  }
}
