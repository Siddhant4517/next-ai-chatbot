"use client";

import { useRef, useState, useEffect } from "react";
import {
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

interface Props {
  chat: { _id: string; title: string };
  isActive: boolean;
  isCollapsed: boolean;
  onLoad: () => void;
  onDelete: (chatId: string) => void;
  onRename: (chatId: string, newTitle: string) => void;
}

export default function ChatMenuItem({
  chat,
  isActive,
  isCollapsed,
  onLoad,
  onDelete,
  onRename,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(chat.title);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const renameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isRenaming) {
      setTimeout(() => renameRef.current?.focus(), 50);
      renameRef.current?.select();
    }
  }, [isRenaming]);

  function handleRenameSubmit() {
    if (renameValue.trim() && renameValue.trim() !== chat.title) {
      onRename(chat._id, renameValue.trim());
    }
    setIsRenaming(false);
  }

  function handleRenameKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleRenameSubmit();
    if (e.key === "Escape") {
      setRenameValue(chat.title);
      setIsRenaming(false);
    }
  }

  if (isCollapsed) {
    return (
      <button
        onClick={onLoad}
        title={chat.title}
        className={`w-full flex items-center justify-center py-2.5 rounded-xl transition-all duration-150 ${
          isActive
            ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
            : "text-[#6b6b7b] hover:bg-[#1a1a1e] hover:text-white border border-transparent"
        }`}
      >
        <MessageSquare size={13} />
      </button>
    );
  }

  return (
    <>
      <div ref={menuRef} className="relative group">
        {isRenaming ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5">
            <input
              ref={renameRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={handleRenameKeyDown}
              className="flex-1 bg-[#1a1a1e] border border-orange-500/40 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={handleRenameSubmit}
              className="text-green-400 hover:text-green-300 transition-colors p-1"
            >
              <Check size={13} />
            </button>
            <button
              onClick={() => { setRenameValue(chat.title); setIsRenaming(false); }}
              className="text-[#6b6b7b] hover:text-white transition-colors p-1"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={onLoad}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-150 ${
              isActive
                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                : "text-[#9898a8] hover:bg-[#1a1a1e] hover:text-white border border-transparent"
            }`}
          >
            <MessageSquare
              size={13}
              className={`shrink-0 ${isActive ? "text-orange-400" : "text-[#6b6b7b]"}`}
            />
            <span className="truncate flex-1">{chat.title}</span>
            <span
              onClick={(e) => { e.stopPropagation(); setMenuOpen((prev) => !prev); }}
              className={`p-0.5 rounded-md hover:bg-[#2e2e34] transition-colors shrink-0 ${
                menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <MoreHorizontal size={14} className="text-[#6b6b7b]" />
            </span>
          </button>
        )}

        {menuOpen && !isRenaming && (
          <div className="absolute right-0 top-full mt-1 z-50 w-40 bg-[#1a1a1e] border border-[#2e2e34] rounded-xl shadow-2xl overflow-hidden">
            <button
              onClick={() => { setIsRenaming(true); setMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#9898a8] hover:bg-[#242428] hover:text-white transition-all"
            >
              <Pencil size={13} className="text-[#6b6b7b]" />
              Rename
            </button>
            <button
              onClick={() => { setShowDeleteModal(true); setMenuOpen(false); }} // ✅ open modal
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative z-10 bg-[#111113] border border-[#242428] rounded-2xl p-6 w-85 shadow-2xl">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-[#6b6b7b] hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <Trash2 size={18} className="text-red-400" />
            </div>

            <h3 className="font-display text-white font-semibold text-base mb-1">
              Delete chat?
            </h3>
            <p className="text-[#6b6b7b] text-sm mb-5 leading-relaxed">
              <span className="text-white font-medium">"{chat.title}"</span> will
              be permanently deleted along with all its messages.
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1a1a1e] border border-[#2e2e34] text-sm text-[#9898a8] hover:bg-[#242428] hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => { onDelete(chat._id); setShowDeleteModal(false); }}
                className="flex-1 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-500 text-sm text-white font-medium transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}