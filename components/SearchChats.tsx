"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, MessageSquare, PlusIcon } from "lucide-react";

interface SerializedChat {
  _id: string;
  title: string;
  createdAt: string;
}

interface Props {
  chats: SerializedChat[];
  activeChatId: string | null;
  onLoadChat: (chatId: string) => void;
  onNewChat: () => void;
  isCollapsed: boolean;
}

function groupChatsByDate(chats: SerializedChat[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const groups: Record<string, SerializedChat[]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    "Previous 30 Days": [],
    Older: [],
  };

  chats.forEach((chat) => {
    const date = new Date(chat.createdAt);
    if (date >= today) groups["Today"].push(chat);
    else if (date >= yesterday) groups["Yesterday"].push(chat);
    else if (date >= sevenDaysAgo) groups["Previous 7 Days"].push(chat);
    else if (date >= thirtyDaysAgo) groups["Previous 30 Days"].push(chat);
    else groups["Older"].push(chat);
  });

  return groups;
}

function highlightMatch(title: string, query: string) {
  if (!query.trim()) return <span>{title}</span>;
  const index = title.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return <span>{title}</span>;
  return (
    <>
      <span>{title.slice(0, index)}</span>
      <span className="text-orange-400 font-medium">
        {title.slice(index, index + query.length)}
      </span>
      <span>{title.slice(index + query.length)}</span>
    </>
  );
}

export default function SearchChats({
  chats,
  activeChatId,
  onLoadChat,
  onNewChat,
  isCollapsed = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Open on "/" key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  function handleClose() {
    setIsOpen(false);
    setQuery("");
  }

  function handleSelect(chatId: string) {
    onLoadChat(chatId);
    handleClose();
  }

  function handleNewChat() {
    onNewChat();
    handleClose();
  }

  // Search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return chats.filter((c) => c.title.toLowerCase().includes(q)).slice(0, 10);
  }, [query, chats]);

  // Grouped chats for empty query
  const groupedChats = useMemo(() => groupChatsByDate(chats), [chats]);

  if (!isOpen) {
    return isCollapsed ? (
      <div className="px-3 pb-2">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center py-2.5 rounded-xl text-[#6b6b7b] hover:bg-[#1a1a1e] hover:text-orange-400 transition-all border border-transparent hover:border-[#2e2e34]"
          title="Search chats"
        >
          <Search size={15} />
        </button>
      </div>
    ) : (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#6b6b7b] hover:bg-[#1a1a1e] hover:text-white transition-all duration-150 border border-transparent hover:border-[#2e2e34]"
      >
        <Search size={13} className="shrink-0" />
        <span className="text-xs">Search chats...</span>
        <span className="ml-auto text-[10px] bg-[#1a1a1e] border border-[#2e2e34] px-1.5 py-0.5 rounded text-[#4a4a58]">
          /
        </span>
      </button>
    );
  }

  return (
    <>
      {/* ✅ Full screen backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[10vh]"
        onClick={handleClose}
      >
        {/* ✅ Modal */}
        <div
          className="w-full max-w-[640px] mx-4 bg-[#111113] border border-[#242428] rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#242428]">
            <Search size={16} className="text-[#6b6b7b] shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats..."
              className="flex-1 bg-transparent text-white text-sm placeholder-[#4a4a58] focus:outline-none"
            />
            <button
              onClick={handleClose}
              className="text-[#6b6b7b] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#1a1a1e]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto py-2">
            {/* New Chat option — always shown */}
            <div className="px-2 mb-1">
              <button
                onClick={handleNewChat}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#9898a8] hover:bg-[#1a1a1e] hover:text-white transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1a1a1e] border border-[#2e2e34] flex items-center justify-center">
                  <PlusIcon size={14} className="text-orange-400" />
                </div>
                <span>New chat</span>
              </button>
            </div>

            {/* Search results */}
            {query.trim() ? (
              searchResults.length === 0 ? (
                <p className="text-xs text-[#4a4a58] text-center py-6">
                  No chats found for "{query}"
                </p>
              ) : (
                <div className="px-2 space-y-0.5">
                  {searchResults.map((chat) => (
                    <button
                      key={chat._id}
                      onClick={() => handleSelect(chat._id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        activeChatId === chat._id
                          ? "bg-orange-500/10 text-orange-400"
                          : "text-[#9898a8] hover:bg-[#1a1a1e] hover:text-white"
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#1a1a1e] border border-[#2e2e34] flex items-center justify-center shrink-0">
                        <MessageSquare size={13} className="text-[#6b6b7b]" />
                      </div>
                      <span className="truncate">
                        {highlightMatch(chat.title, query)}
                      </span>
                    </button>
                  ))}
                </div>
              )
            ) : (
              // ✅ Grouped by date when no query
              Object.entries(groupedChats).map(([group, items]) =>
                items.length === 0 ? null : (
                  <div key={group} className="px-2 mb-2">
                    <p className="text-[10px] font-semibold text-[#4a4a58] uppercase tracking-widest px-3 py-1.5">
                      {group}
                    </p>
                    <div className="space-y-0.5">
                      {items.map((chat) => (
                        <button
                          key={chat._id}
                          onClick={() => handleSelect(chat._id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                            activeChatId === chat._id
                              ? "bg-orange-500/10 text-orange-400"
                              : "text-[#9898a8] hover:bg-[#1a1a1e] hover:text-white"
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#1a1a1e] border border-[#2e2e34] flex items-center justify-center shrink-0">
                            <MessageSquare
                              size={13}
                              className="text-[#6b6b7b]"
                            />
                          </div>
                          <span className="truncate">{chat.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ),
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
