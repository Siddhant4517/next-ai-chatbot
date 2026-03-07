import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Chat } from "@/models/Chat";
import { Message } from "@/models/Message";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, streamText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { messages,chatId } = await req.json();

  const userMessage = messages[messages.length - 1];

  await connectDB();

   await Message.create({
    userId: session.user?.id,
    chatId,
    role: "user",
    content: userMessage.content,
  });

   const chat = await Chat.findById(chatId);
  if (chat?.title === "New Chat") {
    const { text: title } = await generateText({
      model: google("gemini-3-flash-preview"),
      prompt: `Generate a short, meaningful chat title (max 5 words, no quotes, no punctuation) for a conversation that starts with: "${userMessage.content}"`,
    });

    await Chat.findByIdAndUpdate(chatId, {
      title: title.trim().slice(0, 50)  // safety trim
    });
  }

  const result = streamText({
    model: google("gemini-3-flash-preview"),
    messages,
    onFinish: async ({ text }) => {
      await Message.create({
        userId: session.user?.id,
        chatId,
        role: "assistant",
        content: text,
      });
    },
  });

  return result.toDataStreamResponse(); 
}