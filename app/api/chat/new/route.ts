import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Chat } from "@/models/Chat";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const chat = await Chat.create({ 
      userId: session.user?.id,
      title: "New Chat"
    });

    return NextResponse.json({ chatId: chat._id.toString() });

  } catch (error) {
    console.error("Create chat error:", error);
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
  }
}