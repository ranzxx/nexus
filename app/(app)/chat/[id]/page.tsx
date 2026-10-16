import { getConversationMessages } from "@/actions/conversation";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import ChatInterface from "@/components/chat/ChatInterface";
import { db } from "@/db/drizzle";
import { auth } from "@/lib/auth";
import { conversation, conversationDocument, document } from "@/db/schema";
import { and, eq } from "drizzle-orm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ConversationPage({ params }: Props) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const [conv] = await db
    .select()
    .from(conversation)
    .where(
      and(eq(conversation.id, id), eq(conversation.userId, session.user.id)),
    );

  if (!conv) notFound();

  const messages = await getConversationMessages(id);

  const documents = await db
    .select({ id: document.id, name: document.name })
    .from(conversationDocument)
    .innerJoin(document, eq(conversationDocument.documentId, document.id))
    .where(eq(conversationDocument.conversationId, id));

  return (
    <ChatInterface
      key={id}
      conversationId={id}
      initialMessages={messages}
      initialDocuments={documents}
    />
  );
}
