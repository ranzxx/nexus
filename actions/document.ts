"use server";

import { db } from "@/db/drizzle";
import { document, chunk } from "@/db/schema";
import { and, count, eq, gte } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  extractTextFromPDF,
  splitIntoChunks,
  generateDocumentEmbeddings,
} from "@/lib/rag";


export async function processDocument({
  name,
  fileUrl,
  fileSize,
}: {
  name: string;
  fileUrl: string;
  fileSize: number;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const isPro = session.user.plan === "pro";

  if (!isPro) {
    // cek upload hari ini
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [{ value }] = await db
      .select({ value: count() })
      .from(document)
      .where(
        and(
          eq(document.userId, session.user.id),
          gte(document.createdAt, startOfDay),
        ),
      );

    if (value >= 5) {
      throw new Error(
        "Free plan limit: 5 documents per day. Upgrade to Pro for unlimited uploads.",
      );
    }
  }

  const [doc] = await db
    .insert(document)
    .values({
      name,
      fileUrl,
      fileSize,
      fileType: "pdf",
      userId: session.user.id,
    })
    .returning();

  const response = await fetch(fileUrl);
  const buffer = Buffer.from(await response.arrayBuffer());
  const text = await extractTextFromPDF(buffer);
  const chunks = splitIntoChunks(text);
  const embeddings = await generateDocumentEmbeddings(chunks);

  await db.insert(chunk).values(
    chunks.map((content, index) => ({
      content,
      embedding: embeddings[index],
      documentId: doc.id,
      chunkIndex: index,
    })),
  );

  revalidatePath("/documents");
  return doc;
}

export async function getDocuments() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return await db
    .select()
    .from(document)
    .where(eq(document.userId, session.user.id));
}

export async function deleteDocument(id: string) {
  await db.delete(document).where(eq(document.id, id));
  revalidatePath("/documents");
}
