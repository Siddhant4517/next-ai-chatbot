"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, X } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export default function LogoutButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-surface-400 hover:bg-surface-800 hover:text-white transition-all duration-150 group"
      >
        <LogOut size={14} className="group-hover:text-orange-400 transition-colors" />
        Sign Out
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative z-10 bg-surface-900 border border-surface-700 rounded-2xl p-6 w-[340px] shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-surface-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <LogOut size={18} className="text-red-400" />
            </div>

            <h3 className="font-display text-white font-semibold text-base mb-1">
              Sign out?
            </h3>
            <p className="text-surface-400 text-sm mb-5 leading-relaxed">
              You'll need to sign in again to access your conversations.
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface-800 border border-surface-600 text-sm text-surface-300 hover:bg-surface-700 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => signOut({ callbackUrl: ROUTES.LOGIN })}
                className="flex-1 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-500 text-sm text-white font-medium transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}