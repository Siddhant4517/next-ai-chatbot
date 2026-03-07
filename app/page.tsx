import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Chat } from "@/models/Chat";
import ChatLayout from "@/components/ChatLayout";
import { ROUTES } from "@/lib/constants";

export const metadata = { title: `${process.env.NEXT_PUBLIC_APP_NAME ?? "OrangeAI"} | Home` };

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.LOGIN);

  await connectDB();

  const chats = await Chat.find({ userId: session.user?.id })
    .sort({ createdAt: -1 })
    .lean();

  const serializedChats = chats.map((c) => ({
    _id: c._id.toString(),
    title: c.title,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <ChatLayout user={session.user} chats={serializedChats} initialMessages={[]}
      activeChatId={null}/>
  );
}