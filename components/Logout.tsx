"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, X } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export default function LogoutButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center gap-2 p-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition"
      >
        <LogOut size={16} />
        Logout
      </button>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Box */}
          <div className="relative z-10 bg-gray-900 border border-gray-700 rounded-2xl p-6 w-[320px] shadow-2xl">
            
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4">
              <LogOut size={22} className="text-red-400" />
            </div>

            {/* Text */}
            <h3 className="text-white font-semibold text-lg mb-1">
              Logout?
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to logout? You'll need to sign in again to access your chats.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-800 text-sm text-gray-300 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => signOut({ callbackUrl: ROUTES.LOGIN })}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-sm text-white font-medium hover:bg-red-500 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}