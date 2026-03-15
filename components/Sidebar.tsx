"use client";

import { MessageSquare, PlusIcon, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
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
  isCollapsed: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onLoadChat: (chatId: string) => void;
}

export default function Sidebar({
  user,
  chats,
  activeChatId,
  loadingNew,
  isCollapsed,
  onToggle,
  onNewChat,
  onLoadChat,
}: Props) {
  return (
    <aside
      className={`relative flex flex-col bg-[#111113] border-r border-[#242428] transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[60px]" : "w-[280px]"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-[#242428] border border-[#2e2e34] flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all duration-150 group"
      >
        {isCollapsed
          ? <ChevronRight size={12} className="text-[#9898a8] group-hover:text-white" />
          : <ChevronLeft size={12} className="text-[#9898a8] group-hover:text-white" />
        }
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-2.5 p-4 border-b border-[#242428] ${isCollapsed ? "justify-center" : ""}`}>
        <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
          <Sparkles size={14} className="text-orange-400" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="font-display text-base font-bold text-white tracking-tight truncate">
              {process.env.NEXT_PUBLIC_APP_NAME || "OrangeAI"}
            </h1>
            <p className="text-[10px] text-[#6b6b7b] truncate">{user.email}</p>
          </div>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          disabled={loadingNew}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white text-sm font-medium transition-all disabled:opacity-40 shadow-[0_0_20px_rgba(249,115,22,0.15)] ${
            isCollapsed ? "px-0" : "px-3"
          }`}
          title={isCollapsed ? "New Chat" : undefined}
        >
          <PlusIcon size={15} className="shrink-0" />
          {!isCollapsed && (loadingNew ? "Creating..." : "New Chat")}
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {!isCollapsed && (
          <p className="text-[10px] font-display font-semibold text-[#6b6b7b] px-3 py-2 uppercase tracking-widest">
            Recent
          </p>
        )}

        {chats.map((chat) => (
          <button
            key={chat._id}
            onClick={() => onLoadChat(chat._id)}
            title={isCollapsed ? chat.title : undefined}
            className={`w-full flex items-center gap-2.5 rounded-xl text-left text-sm transition-all duration-150 group ${
              isCollapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
            } ${
              activeChatId === chat._id
                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                : "text-[#9898a8] hover:bg-[#1a1a1e] hover:text-white border border-transparent"
            }`}
          >
            <MessageSquare
              size={13}
              className={`shrink-0 ${
                activeChatId === chat._id
                  ? "text-orange-400"
                  : "text-[#6b6b7b] group-hover:text-[#9898a8]"
              }`}
            />
            {!isCollapsed && <span className="truncate">{chat.title}</span>}
          </button>
        ))}

        {!isCollapsed && chats.length === 0 && (
          <p className="text-xs text-[#4a4a58] px-3 py-2">No chats yet</p>
        )}
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-[#242428]">
        {isCollapsed ? (
          // Collapsed — just icon
          <LogoutButton iconOnly />
        ) : (
          <LogoutButton />
        )}
      </div>
    </aside>
  );
}