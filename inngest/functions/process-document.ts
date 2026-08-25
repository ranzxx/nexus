import { inngest } from "../client";
import { db } from "@/db/drizzle";
import { document, chunk } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  extractTextFromPDF,
  splitIntoChunks,
  generateDocumentEmbeddings,
} from "@/lib/rag";
import { logger } from "@/lib/logger";
import * as Sentry from "@sentry/nextjs";

export const processDocumentEmbedding = inngest.createFunction(
  {
    id: "process-document-embedding",
    retries: 2,
    triggers: [{ event: "document/uploaded" }],
    onFailure: async ({ event }) => {
      const originalEvent = event.data.event;
      const documentId = originalEvent.data.documentId;

      await db
        .update(document)
        .set({ status: "failed" })
        .where(eq(document.id, documentId));

      logger.error({ documentId }, "Document embedding permanently failed");
      Sentry.captureException(new Error(event.data.error.message), {
        tags: { documentId },
      });
    },
  },

  async ({ event, step }) => {
    const { documentId, fileUrl } = event.data;

    const text = await step.run("extract-pdf-text", async () => {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      return await extractTextFromPDF(buffer);
    });

    const chunks = await step.run("split-chunks", async () => {
      return splitIntoChunks(text);
    });

    const embeddings = await step.run("generate-embeddings", async () => {
      return await generateDocumentEmbeddings(chunks);
    });

    await step.run("save-chunks", async () => {
      await db.insert(chunk).values(
        chunks.map((content: string, index: number) => ({
          content,
          embedding: embeddings[index],
          documentId,
          chunkIndex: index,
        })),
      );
    });

    await step.run("mark-document-ready", async () => {
      await db
        .update(document)
        .set({ status: "ready" })
        .where(eq(document.id, documentId));
    });

    logger.info({ documentId }, "Document embedding completed");
    return { success: true, documentId, chunkCount: chunks.length };
  },
);
