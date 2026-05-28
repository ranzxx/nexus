"use server";

import { db } from "@/db/drizzle";
import { document, chunk } from "@/db/schema";
import { eq } from "drizzle-orm";
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

  // 1. Simpan dokumen ke database
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

  // 2. Download file dari Uploadthing
  const response = await fetch(fileUrl);
  const buffer = Buffer.from(await response.arrayBuffer());

  // 3. Extract teks
  const text = await extractTextFromPDF(buffer);

  // 4. Split jadi chunks
  const chunks = splitIntoChunks(text);

  // 5. Generate embeddings
  const embeddings = await generateDocumentEmbeddings(chunks);

  // 6. Simpan chunks + embeddings ke database
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
