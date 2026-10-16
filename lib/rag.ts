import { db } from "@/db/drizzle";
import { CohereClient } from "cohere-ai";
import { sql } from "drizzle-orm";

const EMBED_BATCH_SIZE = 96;

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

export { splitIntoChunks } from "./chunk-text";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const { getDocumentProxy, extractText } = await import("unpdf");

  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, {
    mergePages: true,
  });

  return text;
}

async function embedBatch(
  texts: string[],
  inputType: "search_document" | "search_query",
): Promise<number[][]> {
  const response = await cohere.embed({
    texts,
    model: "embed-english-v3.0",
    inputType,
    embeddingTypes: ["float"],
  });

  const embeddings = response.embeddings;
  if (Array.isArray(embeddings)) return embeddings;
  if (!embeddings.float) {
    throw new Error("Cohere did not return float embeddings.");
  }
  return embeddings.float;
}

export async function generateDocumentEmbeddings(
  texts: string[],
): Promise<number[][]> {
  const result: number[][] = [];
  for (let i = 0; i < texts.length; i += EMBED_BATCH_SIZE) {
    const batch = texts.slice(i, i + EMBED_BATCH_SIZE);
    result.push(...(await embedBatch(batch, "search_document")));
  }
  return result;
}

export async function generateQueryEmbedding(text: string): Promise<number[]> {
  const [embedding] = await embedBatch([text], "search_query");
  return embedding;
}

export async function searchRelevantChunks(
  queryEmbedding: number[],
  conversationId: string,
  limit = 5,
): Promise<string[]> {
  const embedding = JSON.stringify(queryEmbedding);

  const results = await db.execute(sql`
    SELECT c.content
    FROM chunk c
    INNER JOIN conversation_document cd ON cd.document_id = c.document_id
    WHERE cd.conversation_id = ${conversationId}
    ORDER BY c.embedding <=> ${embedding}::vector
    LIMIT ${limit}
  `);

  return results.map((row) => row.content as string);
}