"use client";

import { MessageSquare, PlusIcon, Sparkles } from "lucide-react";
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
    <aside className="w-[20%] min-w-[220px] flex flex-col bg-surface-900 border-r border-surface-700">

      {/* Logo */}
      <div className="p-5 border-b border-surface-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shadow-[var(--orange-glow)]">
            <Sparkles size={14} className="text-white" />
          </div>
          <h1 className="font-display text-lg font-800 tracking-tight text-white">
            {process.env.NEXT_PUBLIC_APP_NAME || "OrangeAI"}
          </h1>
        </div>
        <p className="text-xs text-surface-500 mt-2 truncate font-sans pl-9">
          {user.email}
        </p>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          disabled={loadingNew}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white text-sm font-medium transition-all duration-150 disabled:opacity-40 shadow-[var(--orange-glow)] hover:shadow-[var(--orange-glow-strong)]"
        >
          <PlusIcon size={15} />
          {loadingNew ? "Creating..." : "New Chat"}
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        <p className="text-[10px] font-display font-semibold text-surface-500 px-3 py-2 uppercase tracking-widest">
          Recent
        </p>
        {chats.length === 0 && (
          <p className="text-xs text-surface-500 px-3 py-2">No chats yet</p>
        )}
        {chats.map((chat) => (
          <button
            key={chat._id}
            onClick={() => onLoadChat(chat._id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-150 group ${
              activeChatId === chat._id
                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                : "text-surface-400 hover:bg-surface-800 hover:text-white border border-transparent"
            }`}
          >
            <MessageSquare
              size={13}
              className={`shrink-0 ${activeChatId === chat._id ? "text-orange-400" : "text-surface-500 group-hover:text-surface-300"}`}
            />
            <span className="truncate">{chat.title}</span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-surface-700">
        <LogoutButton />
      </div>
    </aside>
  );
}