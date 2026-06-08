import { db } from "@/db/drizzle";
import { CohereClient } from "cohere-ai";
import { sql } from "drizzle-orm";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const { getDocumentProxy, extractText } = await import("unpdf");
  
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, {
    mergePages: true,
  });

  return text;
}

// 2. Split teks jadi chunks
export function splitIntoChunks(text: string, chunkSize = 500): string[] {
  const words = text.split(" ");
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    if (chunk.trim()) chunks.push(chunk);
  }

  return chunks;
}

export async function generateDocumentEmbeddings(
  texts: string[],
): Promise<number[][]> {
  const response = await cohere.embed({
    texts,
    model: "embed-english-v3.0",
    inputType: "search_document",
    embeddingTypes: ["float"],
  });

  const embeddings = response.embeddings;

  if (Array.isArray(embeddings)) {
    return embeddings;
  }

  if (!embeddings.float) {
    throw new Error("Cohere tidak mengembalikan float embeddings.");
  }

  return embeddings.float;
}

export async function generateQueryEmbedding(text: string): Promise<number[]> {
  const response = await cohere.embed({
    texts: [text],
    model: "embed-english-v3.0",
    inputType: "search_query",
    embeddingTypes: ["float"],
  });

  const embeddings = response.embeddings;

  if (Array.isArray(embeddings)) {
    return embeddings[0];
  }

  if (!embeddings.float?.[0]) {
    throw new Error("Cohere tidak mengembalikan query embedding.");
  }

  return embeddings.float[0];
}

// 5. Search chunks yang relevan berdasarkan query
export async function searchRelevantChunks(
  queryEmbedding: number[],
  documentId: string,
  limit = 5
): Promise<string[]> {
  const embedding = JSON.stringify(queryEmbedding)

  const results = await db.execute(sql`
    SELECT content
    FROM chunk
    WHERE document_id = ${documentId}
    ORDER BY embedding <=> ${embedding}::vector
    LIMIT ${limit}
  `)

  return results.map((row) => row.content as string);
}