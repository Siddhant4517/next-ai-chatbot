import { auth } from "@/lib/auth";
import { AI_CONFIG } from "@/lib/constants";
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
  const { messages, chatId, imageBase64, imageMimeType } = await req.json();

  if (!chatId) return new Response("chatId is required", { status: 400 });

  await connectDB();

  const userMessage = messages[messages.length - 1];

  await Message.create({
    userId: session.user?.id,
    chatId,
    role: "user",
    content: userMessage.content,
    imageBase64: imageBase64 ?? null,
    imageMimeType: imageMimeType ?? null,
  });

  const chat = await Chat.findById(chatId);
  if (chat?.title === "New Chat") {
    const { text: title } = await generateText({
      model: google(process.env.GEMINI_MODEL || "gemini-3-flash-preview"),
      prompt: AI_CONFIG.TITLE_PROMPT(userMessage.content),
    });

    await Chat.findByIdAndUpdate(chatId, {
      title: title.trim().slice(0, 50),
    });
  }

  const history = await Message.find({
    chatId,
    userId: session.user?.id,
  })
    .sort({ createdAt: 1 })
    .lean();

  // ✅ Format history for Gemini — only role and content needed
  const formattedMessages = history.map((m, index) => {
    const isLast = index === history.length - 1;

    // If this is the last message and image was uploaded
    if (isLast && imageBase64) {
      return {
        role: m.role as "user" | "assistant",
        content: [
          {
            type: "image" as const,
            image: imageBase64,
            mimeType: imageMimeType || "image/jpeg",
          },
          {
            type: "text" as const,
            text: m.content || "What is in this image?",
          },
        ],
      };
    }

    return {
      role: m.role as "user" | "assistant",
      content: m.content,
    };
  });

  const result = streamText({
    model: google(process.env.GEMINI_MODEL || "gemini-3-flash-preview"),
    system: `You are OrangeAI, a helpful assistant. Today's date is ${new Date().toDateString()}.`,
    messages: formattedMessages,
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