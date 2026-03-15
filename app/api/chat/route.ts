import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Chat } from "@/models/Chat";
import { Message } from "@/models/Message";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, generateText } from "ai";
import { AI_CONFIG, CHAT_DEFAULTS } from "@/lib/constants";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const MODEL = process.env.GEMINI_MODEL || AI_CONFIG.MODEL;

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { messages, chatId: existingChatId, imageBase64, imageMimeType } = await req.json();

  await connectDB();

  const userMessage = messages[messages.length - 1];

  // ✅ Create chat if new
  let chatId = existingChatId;
  let isNewChat = false;

  if (!chatId) {
    const chat = await Chat.create({
      userId: session.user?.id,
      title: CHAT_DEFAULTS.NEW_CHAT_TITLE,
    });
    chatId = chat._id.toString();
    isNewChat = true;
  }

  // Save user message
  await Message.create({
    userId: session.user?.id,
    chatId,
    role: "user",
    content: userMessage.content || "What is in this image?",
    imageBase64: imageBase64 ?? null,
    imageMimeType: imageMimeType ?? null,
  });

  // ✅ Generate title
  let title = CHAT_DEFAULTS.NEW_CHAT_TITLE;
  if (isNewChat) {
    const { text } = await generateText({
      model: google(MODEL),
      prompt: AI_CONFIG.TITLE_PROMPT(userMessage.content || "image message"),
    });
    title = text.trim().slice(0, AI_CONFIG.MAX_TITLE_LENGTH);
    await Chat.findByIdAndUpdate(chatId, { title });
  } else {
    const chat = await Chat.findById(chatId);
    if (chat?.title === CHAT_DEFAULTS.NEW_CHAT_TITLE) {
      const { text } = await generateText({
        model: google(MODEL),
        prompt: AI_CONFIG.TITLE_PROMPT(userMessage.content || "image message"),
      });
      title = text.trim().slice(0, AI_CONFIG.MAX_TITLE_LENGTH);
      await Chat.findByIdAndUpdate(chatId, { title });
    } else {
      title = chat?.title ?? title;
    }
  }

  // Load full history
  const history = await Message.find({ chatId, userId: session.user?.id })
    .sort({ createdAt: 1 })
    .lean();

  const formattedMessages = history.map((m) => {
    if (m.imageBase64) {
      return {
        role: m.role as "user" | "assistant",
        content: [
          { type: "image" as const, image: m.imageBase64, mimeType: m.imageMimeType || "image/jpeg" },
          { type: "text" as const, text: m.content },
        ],
      };
    }
    return { role: m.role as "user" | "assistant", content: m.content };
  });

  const result = streamText({
    model: google(MODEL),
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

  // ✅ Return chatId and title in headers so client can read them
  return result.toDataStreamResponse({
    headers: {
      "x-chat-id": chatId,
      "x-chat-title": encodeURIComponent(title),
    },
  });
}