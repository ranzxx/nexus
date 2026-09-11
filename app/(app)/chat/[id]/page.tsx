import { getConversationMessages } from "@/actions/conversation";
import { notFound } from "next/navigation";
import ChatInterface from "@/components/chat/ChatInterface";
import { db } from "@/db/drizzle";
import { conversation, conversationDocument, document } from "@/db/schema";
import { eq } from "drizzle-orm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ConversationPage({ params }: Props) {
  const { id } = await params;

  const [conv] = await db
    .select()
    .from(conversation)
    .where(eq(conversation.id, id));

  if (!conv) notFound();

  const messages = await getConversationMessages(id);
  if (!messages) notFound();

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
