import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Chat } from "@/models/Chat";
import ChatLayout from "@/components/ChatLayout";

export default async function NewChatPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();

  const chats = await Chat.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const serializedChats = chats.map((c) => ({
    _id: c._id.toString(),
    title: c.title,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <ChatLayout
      user={session.user}
      chats={serializedChats}
      initialMessages={[]}
      activeChatId={null}
      isNewChat={true}
    />
  );
}