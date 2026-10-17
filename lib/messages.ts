import { db } from "@/db/drizzle";
import { conversation, message } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function saveMessage({
  conversationId,
  role,
  content,
}: {
  conversationId: string;
  role: "user" | "assistant";
  content: string;
}) {
  await db.insert(message).values({ conversationId, role, content });
  await db
    .update(conversation)
    .set({ updatedAt: new Date() })
    .where(eq(conversation.id, conversationId));
}
