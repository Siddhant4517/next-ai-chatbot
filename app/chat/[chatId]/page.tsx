import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Chat } from "@/models/Chat";
import { Message } from "@/models/Message";
import ChatLayout from "@/components/ChatLayout";
import { ROUTES } from "@/lib/constants";

export const metadata = { title: `Chat` };

interface Props {
  params: Promise<{ chatId: string }>;
}

export default async function ChatPage({ params }: Props) {
  const { chatId } = await params;
  const session = await auth();
  if (!session?.user) redirect(ROUTES.LOGIN);

  await connectDB();

  // Load all chats for sidebar
  const chats = await Chat.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const serializedChats = chats.map((c) => ({
    _id: c._id.toString(),
    title: c.title,
    createdAt: c.createdAt.toISOString(),
  }));

  // Load messages for this specific chat
  const messages = await Message.find({
    chatId: chatId,
    userId: session.user.id,
  })
    .sort({ createdAt: 1 })
    .lean();

  const serializedMessages = messages.map((m) => ({
    _id: m._id.toString(),
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  return (
    <ChatLayout
      user={session.user}
      chats={serializedChats}
      initialMessages={serializedMessages}
      activeChatId={chatId}
    />
  );
}