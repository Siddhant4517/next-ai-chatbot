"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function RegisterClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    startTransition(async () => {
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
        },
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
      
      router.push("/login");
    } catch (error) {
      setError("Network error");
    }
    });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600">
      <div className="flex w-[850px] h-[520px] rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden">
        {/* LEFT */}
        <div className="flex flex-col justify-center items-center w-1/2 p-10 text-white">
          <div className="text-5xl font-bold mb-4">🤖</div>
          <h1 className="text-3xl font-bold">AI-Chat-Bot</h1>
          <p className="text-sm text-gray-200 mt-2 text-center">
            Create your AI-powered account
          </p>
        </div>

        {/* Divider */}
        <div className="w-px bg-white/20" />

        {/* RIGHT */}
        <div className="flex flex-col justify-center w-1/2 p-10 text-white">
          <h2 className="text-2xl font-semibold mb-6">Create Account 🚀</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Name"
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white"
            />
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/20 text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-black hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {error && <p className="text-red-300 text-md">{error}</p>}

            <button className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:scale-[1.03] transition">
              {isPending ? "Creating..." : "Register"}
            </button>
            <p className="text-sm text-gray-200 mt-4 text-center">
              Already have an account?{" "}
              <a
                href="/login"
                className="underline hover:text-white transition"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
