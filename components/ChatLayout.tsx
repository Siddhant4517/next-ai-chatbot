"use client";

import ChatWindow from "@/components/ChatWindow";
import { API, ROUTES } from "@/lib/constants";
import { useChat } from "@ai-sdk/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Sparkles } from "lucide-react";

interface SerializedChat {
  _id: string;
  title: string;
  createdAt: string;
}

interface DBMessage {
  _id: string;
  role: "user" | "assistant";
  content: string;
}

interface Props {
  user: { id: string; name?: string | null; email?: string | null };
  chats: SerializedChat[];
  initialMessages: DBMessage[];
  activeChatId: string | null;
}

export default function ChatLayout({
  user,
  chats: initialChats,
  initialMessages,
  activeChatId,
}: Props) {
  const router = useRouter();
  const [chats, setChats] = useState(initialChats);
  const [loadingNew, setLoadingNew] = useState(false);

  const chatHelpers = useChat({
    api: API.CHAT,
    body: { chatId: activeChatId },
    initialMessages: initialMessages.map((m) => ({
      id: m._id,
      role: m.role,
      content: m.content,
    })),
  });

  async function handleNewChat() {
    setLoadingNew(true);
    const res = await fetch(API.CHAT_NEW, { method: "POST" });
    const { chatId } = await res.json();
    setChats((prev) => [
      { _id: chatId, title: "New Chat", createdAt: new Date().toISOString() },
      ...prev,
    ]);
    router.push(ROUTES.CHAT_ID(chatId));
    setLoadingNew(false);
  }

  function handleLoadChat(chatId: string) {
    router.push(ROUTES.CHAT_ID(chatId));
  }

  return (
    <div className="flex h-screen bg-surface-950 text-white overflow-hidden font-sans">
      <Sidebar
        user={user}
        chats={chats}
        activeChatId={activeChatId}
        loadingNew={loadingNew}
        onNewChat={handleNewChat}
        onLoadChat={handleLoadChat}
      />

      <main className="flex flex-col flex-1 overflow-hidden">
        {!activeChatId ? (
          // Empty state
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 p-8">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-[var(--orange-glow)]">
              <Sparkles size={28} className="text-orange-400" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                Welcome to {process.env.NEXT_PUBLIC_APP_NAME || "OrangeAI"}
              </h2>
              <p className="text-surface-400 text-sm mt-1.5 font-sans">
                Start a new conversation or pick up where you left off
              </p>
            </div>
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white rounded-xl text-sm font-medium transition-all shadow-[var(--orange-glow)] hover:shadow-[var(--orange-glow-strong)]"
            >
              <Sparkles size={15} />
              Start New Chat
            </button>
          </div>
        ) : (
          <ChatWindow chatHelpers={chatHelpers} chatId={activeChatId} />
        )}
      </main>
    </div>
  );
}