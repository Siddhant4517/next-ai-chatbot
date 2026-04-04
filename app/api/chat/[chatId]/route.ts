import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Chat } from "@/models/Chat";
import { Message } from "@/models/Message";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { chatId } = await params;

  await connectDB();

  await Chat.findOneAndDelete({ _id: chatId, userId: session.user?.id });
  await Message.deleteMany({ chatId, userId: session.user?.id });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { chatId } = await params;
  const { title } = await req.json();

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  await connectDB();

  const chat = await Chat.findOneAndUpdate(
    { _id: chatId, userId: session.user?.id },
    { title: title.trim() },
    { new: true }
  );

  return NextResponse.json({ title: chat?.title });
}