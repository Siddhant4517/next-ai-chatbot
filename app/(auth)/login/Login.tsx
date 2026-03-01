"use client";

import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function LoginClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const res = await signIn("credentials", {
        ...form,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        return;
      }

      router.push("/dashboard");
    });
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500">
      {/* Glass Container */}
      <div className="flex w-[850px] h-[500px] rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden">
        {/* LEFT SIDE (Branding) */}
        <div className="flex flex-col justify-center items-center w-1/2 p-10 text-white">
          <div className="text-5xl font-bold mb-4">🤖</div>
          <h1 className="text-3xl font-bold">AI-Chat-Bot</h1>
          <p className="text-sm text-gray-200 mt-2 text-center">
            Smart conversations powered by AI
          </p>
        </div>

        {/* Divider */}
        <div className="w-px bg-white/20" />

        {/* RIGHT SIDE (Form) */}
        <div className="flex flex-col justify-center w-1/2 p-10 text-white">
          <h2 className="text-2xl font-semibold mb-6">Welcome Back 👋</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none"
            />
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-black hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {error && <p className="text-red-300 text-sm">{error}</p>}

            <button
              disabled={isPending}
              className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:scale-[1.03] transition"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-gray-200 mt-4 text-center">
            Don’t have an account?{" "}
            <a href="/register" className="underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
