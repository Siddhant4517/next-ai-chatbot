"use client";

import ChatWindow from "@/components/ChatWindow";
import { API, ROUTES } from "@/lib/constants";
import { useChat } from "@ai-sdk/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Sidebar from "./Sidebar";

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

    // ✅ Navigate to new chat route
    router.push(`${ROUTES.CHAT_ID(chatId)}`);
    setLoadingNew(false);
  }

  function handleLoadChat(chatId: string) {
    // ✅ Just navigate — server loads messages
    router.push(`${ROUTES.CHAT_ID(chatId)}`);
  }

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* SIDEBAR — 20% */}
      <Sidebar
        user={user}
        chats={chats}
        activeChatId={activeChatId}
        loadingNew={loadingNew}
        onNewChat={handleNewChat}
        onLoadChat={handleLoadChat}
      />

      {/* CHAT AREA — 80% */}
      <main className="flex flex-col flex-1">
        {!activeChatId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <div className="text-5xl">🤖</div>
            <h2 className="text-xl font-semibold text-gray-300">
              Welcome, {user.name ?? user.email}
            </h2>
            <p className="text-gray-500 text-sm">
              Start a new chat or select a previous one
            </p>
            <button
              onClick={handleNewChat}
              className="px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-500 transition"
            >
              + New Chat
            </button>
          </div>
        ) : (
          <ChatWindow chatHelpers={chatHelpers} chatId={activeChatId} />
        )}
      </main>
    </div>
  );
}