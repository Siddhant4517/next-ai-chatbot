"use client";

import { PlusIcon, MessageSquare } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import LogoutButton from "./Logout";

interface SerializedChat {
  _id: string;
  title: string;
  createdAt: string;
}

interface Props {
  user: { name?: string | null; email?: string | null };
  chats: SerializedChat[];
  activeChatId: string | null;
  loadingNew: boolean;
  onNewChat: () => void;
  onLoadChat: (chatId: string) => void;
}

export default function Sidebar({
  user,
  chats,
  activeChatId,
  loadingNew,
  onNewChat,
  onLoadChat,
}: Props) {
  return (
    <aside className="w-[20%] min-w-[200px] flex flex-col bg-gray-900 border-r border-gray-800">

      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          {APP_NAME}
        </h1>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{user.email}</p>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
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
            onClick={() => onLoadChat(chat._id)}
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
        <LogoutButton />
      </div>
    </aside>
  );
}