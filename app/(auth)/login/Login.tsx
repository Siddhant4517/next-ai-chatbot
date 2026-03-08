"use client";

import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { Sparkles, Eye, EyeOff } from "lucide-react";

export default function LoginClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await signIn("credentials", { ...form, redirect: false });
      if (res?.error) {
        setError("Invalid email or password");
        return;
      }
      router.push(ROUTES.CHAT);
    });
  }

  return (
    <div className="flex h-screen items-center justify-center bg-surface-950 font-sans">

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex w-[820px] h-[500px] rounded-3xl border border-surface-700 overflow-hidden shadow-2xl relative z-10">

        {/* LEFT — Branding */}
        <div className="flex flex-col justify-center items-center w-[45%] p-10 bg-surface-900 border-r border-surface-700">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 shadow-[var(--orange-glow)]">
            <Sparkles size={30} className="text-orange-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">
            {process.env.NEXT_PUBLIC_APP_NAME || "OrangeAI"}
          </h1>
          <p className="text-surface-400 text-sm mt-2 text-center leading-relaxed">
            Smart conversations powered by AI
          </p>

          {/* Decorative dots */}
          <div className="flex gap-2 mt-8">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <div className="w-2 h-2 rounded-full bg-orange-500/40" />
            <div className="w-2 h-2 rounded-full bg-orange-500/20" />
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="flex flex-col justify-center w-[55%] p-10 bg-surface-950">
          <h2 className="font-display text-2xl font-bold text-white mb-1">
            Welcome back
          </h2>
          <p className="text-surface-400 text-sm mb-7">
            Sign in to continue your conversations
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-surface-600 text-white text-sm placeholder-surface-500 focus:outline-none focus:border-orange-500/60 focus:shadow-[var(--orange-glow)] transition-all"
            />
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-surface-600 text-white text-sm placeholder-surface-500 focus:outline-none focus:border-orange-500/60 focus:shadow-[var(--orange-glow)] transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b7b] hover:text-orange-400 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              disabled={isPending}
              className="w-full py-3 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-all shadow-[var(--orange-glow)] hover:shadow-[var(--orange-glow-strong)] disabled:opacity-50 mt-1"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-surface-500 mt-5 text-center">
            Don't have an account?{" "}
            <a href={ROUTES.REGISTER} className="text-orange-400 hover:text-orange-300 transition-colors underline underline-offset-2">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}