import { getConversationMessages } from "@/actions/conversation";
import { notFound } from "next/navigation";
import ChatInterface from "@/components/chat/ChatInterface";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ConversationPage({ params }: Props) {
  const { id } = await params;
  const messages = await getConversationMessages(id);
  if (!messages) notFound();

  return <ChatInterface conversationId={id} initialMessages={messages} />;
}
