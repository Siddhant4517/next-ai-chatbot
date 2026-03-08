"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { API, ROUTES } from "@/lib/constants";
import { Sparkles, Eye, EyeOff } from "lucide-react";

export default function RegisterClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const res = await fetch(API.REGISTER, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        let data;
        try {
          data = await res.json();
        } catch {
          setError("Server error (not JSON)");
          return;
        }

        if (!res.ok) {
          setError(data.error || "Something went wrong");
          return;
        }

        router.push(ROUTES.LOGIN);
      } catch {
        setError("Network error");
      }
    });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#0c0c0d] font-sans">

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex w-[820px] h-[520px] rounded-3xl border border-[#242428] overflow-hidden shadow-2xl relative z-10">

        {/* LEFT — Branding */}
        <div className="flex flex-col justify-center items-center w-[45%] p-10 bg-[#111113] border-r border-[#242428]">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
            <Sparkles size={30} className="text-orange-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">
            {process.env.NEXT_PUBLIC_APP_NAME || "OrangeAI"}
          </h1>
          <p className="text-[#6b6b7b] text-sm mt-2 text-center leading-relaxed">
            Create your AI-powered account
          </p>

          {/* Decorative dots */}
          <div className="flex gap-2 mt-8">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <div className="w-2 h-2 rounded-full bg-orange-500/40" />
            <div className="w-2 h-2 rounded-full bg-orange-500/20" />
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="flex flex-col justify-center w-[55%] p-10 bg-[#0c0c0d]">
          <h2 className="font-display text-2xl font-bold text-white mb-1">
            Create account
          </h2>
          <p className="text-[#6b6b7b] text-sm mb-7">
            Join OrangeAI and start chatting
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="name"
              placeholder="Full name"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a1e] border border-[#2e2e34] text-white text-sm placeholder-[#6b6b7b] focus:outline-none focus:border-orange-500/60 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all"
            />
            <input
              name="email"
              type="email"
              placeholder="Email address"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a1e] border border-[#2e2e34] text-white text-sm placeholder-[#6b6b7b] focus:outline-none focus:border-orange-500/60 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all"
            />
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1e] border border-[#2e2e34] text-white text-sm placeholder-[#6b6b7b] focus:outline-none focus:border-orange-500/60 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all pr-11"
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
              className="w-full py-3 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(249,115,22,0.15)] hover:shadow-[0_0_30px_rgba(249,115,22,0.25)] disabled:opacity-50 mt-1"
            >
              {isPending ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-[#6b6b7b] mt-5 text-center">
            Already have an account?{" "}
            <a
              href={ROUTES.LOGIN}
              className="text-orange-400 hover:text-orange-300 transition-colors underline underline-offset-2"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}