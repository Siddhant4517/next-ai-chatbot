import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Message } from "@/models/Message";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");

  await connectDB();

  const messages = await Message.find({ chatId, userId: session.user?.id })
    .sort({ createdAt: 1 })
    .lean();

  const serialized = messages.map((m) => ({
    _id: m._id.toString(),
    role: m.role,
    content: m.content,
  }));

  return Response.json({ messages: serialized });
}