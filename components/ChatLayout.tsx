"use client";

import ChatWindow from "@/components/ChatWindow";
import { API, ROUTES } from "@/lib/constants";
import { useChat } from "@ai-sdk/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
  imageBase64?: string | null;
  imageMimeType?: string | null;
}

interface Props {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  chats: SerializedChat[];
  initialMessages: DBMessage[];
  activeChatId: string | null;
  isNewChat?: boolean;
}

export default function ChatLayout({
  user,
  chats: initialChats,
  initialMessages,
  activeChatId,
  isNewChat = false,
}: Props) {
  const router = useRouter();
  const [chats, setChats] = useState(initialChats);
  const [loadingNew, setLoadingNew] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pendingChatIdRef = useRef<string | null>(null);

  const chatHelpers = useChat({
    api: API.CHAT,
    body: { chatId: activeChatId },
    initialMessages: initialMessages.map((m) => ({
      id: m._id,
      role: m.role,
      content: m.content,
      data: {
        imageBase64: m.imageBase64 ?? null,
        imageMimeType: m.imageMimeType ?? null,
      } as Record<string, string | null>,
    })),
    onResponse: async (response) => {
      const newChatId = response.headers.get("x-chat-id");
      const newTitle = response.headers.get("x-chat-title");

      // ✅ Store in state but DON'T navigate yet
    if (newChatId && newTitle) {
      pendingChatIdRef.current = newChatId;  // ✅ set ref, not state
      // ✅ Update sidebar title immediately
      setChats((prev) => {
        const exists = prev.find((c) => c._id === newChatId);
        if (exists) {
          return prev.map((c) =>
            c._id === newChatId
              ? { ...c, title: decodeURIComponent(newTitle) }
              : c
          );
        }
        // New chat — add to sidebar
        return [
          {
            _id: newChatId,
            title: decodeURIComponent(newTitle),
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ];
      });
    }
  },

  // ✅ Navigate AFTER stream is fully complete
  onFinish: () => {
    if (isNewChat && pendingChatIdRef.current) {
      router.replace(ROUTES.CHAT_ID(pendingChatIdRef.current)); // ✅ navigate to new chat
    }
  },
  });

  function handleNewChat() {
    router.push(ROUTES.CHAT_NEW);
  }

  function handleLoadChat(chatId: string) {
    router.push(ROUTES.CHAT_ID(chatId));
  }

  return (
    <div className="flex h-screen bg-surface-950 text-white overflow-hidden font-sans">
      <Sidebar
        user={user}
        chats={chats}
        activeChatId={activeChatId ?? pendingChatIdRef.current}
        loadingNew={loadingNew}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((prev) => !prev)}
        onNewChat={handleNewChat}
        onLoadChat={handleLoadChat}
      />

      <main className="flex flex-col flex-1 overflow-hidden">
        <ChatWindow
          chatHelpers={chatHelpers}
          chatId={activeChatId ?? "new"}
          isNewChat={isNewChat}
        />
      </main>
    </div>
  );
}
