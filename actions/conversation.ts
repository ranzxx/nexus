"use server";

import { db } from "@/db/drizzle";
import { conversation, message } from "@/db/schema";
import { and, asc, count, desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function getSessionOrRedirect() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return session;
}

async function assertCanCreateConversation(userId: string, isPro: boolean) {
  if (isPro) return;

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

export async function createConversation(documentId?: string) {
  const session = await getSessionOrRedirect();
  const userPlan = (session.user as { plan?: string }).plan;
  const isPro = userPlan === "pro";

  await assertCanCreateConversation(session.user.id, isPro);

  const [conv] = await db
    .insert(conversation)
    .values({
      userId: session.user.id,
      documentId: documentId ?? null,
      title: "New Chat",
    })
    .returning();

  return conv;
}

export async function getConversations() {
  const session = await getSessionOrRedirect();
  return await db
    .select()
    .from(conversation)
    .where(eq(conversation.userId, session.user.id))
    .orderBy(desc(conversation.updatedAt));
}

export async function getConversationMessages(conversationId: string) {
  const session = await getSessionOrRedirect();

  const [existingConversation] = await db
    .select({ id: conversation.id })
    .from(conversation)
    .where(
      and(
        eq(conversation.id, conversationId),
        eq(conversation.userId, session.user.id),
      ),
    )
    .limit(1);

  if (!existingConversation) {
    return [];
  }

  return await db
    .select()
    .from(message)
    .where(eq(message.conversationId, conversationId))
    .orderBy(asc(message.createdAt));
}

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

export async function updateConversationTitle(id: string, title: string) {
  await db
    .update(conversation)
    .set({ title, updatedAt: new Date() })
    .where(eq(conversation.id, id));
}

export async function deleteConversation(id: string) {
  const session = await getSessionOrRedirect();

  await db
    .delete(conversation)
    .where(
      and(eq(conversation.id, id), eq(conversation.userId, session.user.id)),
    );

  revalidatePath("/chat");
}

export async function deleteEmptyConversations(userId: string) {
  const conversations = await db
    .select({ id: conversation.id })
    .from(conversation)
    .where(eq(conversation.userId, userId));

  for (const conv of conversations) {
    const messages = await db
      .select({ id: message.id })
      .from(message)
      .where(eq(message.conversationId, conv.id))
      .limit(1);

    if (messages.length === 0) {
      await db.delete(conversation).where(eq(conversation.id, conv.id));
    }
  }
}
