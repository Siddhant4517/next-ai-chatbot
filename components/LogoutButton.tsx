"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="px-5 py-2 rounded-lg bg-white text-black font-medium hover:scale-105 transition"
    >
      Logout
    </button>
  );
}