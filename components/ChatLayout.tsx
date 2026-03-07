"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { PlusIcon, MessageSquare, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import ChatWindow from "@/components/ChatWindow";

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
    api: "/api/chat",
    body: { chatId: activeChatId },
    // ✅ Load messages from server on initial render
    initialMessages: initialMessages.map((m) => ({
      id: m._id,
      role: m.role,
      content: m.content,
    })),
  });

  async function handleNewChat() {
    setLoadingNew(true);
    const res = await fetch("/api/chat/new", { method: "POST" });
    const { chatId } = await res.json();

    setChats((prev) => [
      { _id: chatId, title: "New Chat", createdAt: new Date().toISOString() },
      ...prev,
    ]);

    // ✅ Navigate to new chat route
    router.push(`/chat/${chatId}`);
    setLoadingNew(false);
  }

  function handleLoadChat(chatId: string) {
    // ✅ Just navigate — server loads messages
    router.push(`/chat/${chatId}`);
  }

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">

      {/* SIDEBAR — 20% */}
      <aside className="w-[20%] min-w-[200px] flex flex-col bg-gray-900 border-r border-gray-800">

        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            AI-Chat-Bot
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{user.email}</p>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            disabled={loadingNew}
            className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition text-sm font-medium disabled:opacity-50"
          >
            <PlusIcon size={16} />
            {loadingNew ? "Creating..." : "New Chat"}
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          <p className="text-xs text-gray-500 px-2 py-1 uppercase tracking-wider">
            History
          </p>
          {chats.length === 0 && (
            <p className="text-xs text-gray-600 px-2">No chats yet</p>
          )}
          {chats.map((chat) => (
            <button
              key={chat._id}
              onClick={() => handleLoadChat(chat._id)}
              className={`w-full flex items-center gap-2 p-2.5 rounded-lg text-left text-sm transition hover:bg-gray-800 ${
                activeChatId === chat._id
                  ? "bg-gray-800 text-white"
                  : "text-gray-400"
              }`}
            >
              <MessageSquare size={14} className="shrink-0" />
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-2 p-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

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
          <ChatWindow chatHelpers={chatHelpers} chatId={activeChatId}/>
        )}
      </main>
    </div>
  );
}