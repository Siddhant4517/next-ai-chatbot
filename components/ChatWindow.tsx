"use client";

import { useEffect, useRef, useState } from "react";
import { UseChatHelpers } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowUp, ImagePlus, X } from "lucide-react";

interface Props {
  chatHelpers: UseChatHelpers;
  chatId: string;
}

export default function ChatWindow({ chatHelpers, chatId }: Props) {
  const {
    messages,
    input,
    handleInputChange,
    append,
    status,
    error,
    setInput,
  } = chatHelpers;

  const isResponding = status === "streaming" || status === "submitted";
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMimeType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      // Extract base64 without the data:image/...;base64, prefix
      setImageBase64(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }

  function clearImage() {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if ((!input.trim() && !imageBase64) || !chatId || isResponding) return;

    const content = input;
    const imgBase64 = imageBase64; 
    const imgMimeType = imageMimeType;

    setInput("");
    setImagePreview(null); // ✅ clear preview directly
    setImageBase64(null); // ✅ clear base64 directly
    setImageMimeType("image/jpeg");
    if (fileInputRef.current) fileInputRef.current.value = "";

    await append(
      {
        role: "user",
        content: content || "What is in this image?",
        data: {
        imageBase64: imgBase64,
        imageMimeType: imgMimeType,
      },
      },
      {
        body: {
          chatId,
          imageBase64: imgBase64,
          imageMimeType: imgMimeType,
        },
      },
    );

    clearImage();
  }

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 && (
          <p className="text-center text-surface-500 mt-24 text-sm">
            Send a message to begin...
          </p>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "user" ? (
              <div className="max-w-[65%] flex flex-col gap-2 items-end">
                {/* ✅ Show image above text bubble */}
                {(m.data as any)?.imageBase64 && (
                  <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                    <img
                      src={`data:${(m.data as any)?.imageMimeType || "image/jpeg"};base64,${(m.data as any)?.imageBase64}`}
                      alt="uploaded"
                      className="max-w-[280px] max-h-[200px] object-cover"
                    />
                  </div>
                )}
                {m.content && (
                  <div className="px-4 py-3 rounded-2xl rounded-tr-sm bg-orange-500 text-white text-sm leading-relaxed shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                    {m.content}
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-[85%] text-sm leading-relaxed text-gray-200 prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children, ...props }) {
                      const isBlock = className?.includes("language-");
                      return isBlock ? (
                        <pre className="bg-surface-800 border border-surface-700 rounded-xl p-4 overflow-x-auto my-3 text-xs">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code
                          className="bg-surface-800 border border-surface-700 px-1.5 py-0.5 rounded text-xs text-orange-300"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    h1: ({ children }) => (
                      <h1 className="font-display text-lg font-bold mt-4 mb-1 text-white">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="font-display text-base font-bold mt-3 mb-1 text-white">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="font-display text-sm font-semibold mt-2 mb-1 text-white">
                        {children}
                      </h3>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-1 my-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-1 my-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-300">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-orange-300">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-gray-400">{children}</em>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 underline underline-offset-2 hover:text-orange-300 transition-colors"
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-orange-500/50 pl-3 my-2 text-gray-400 italic">
                        {children}
                      </blockquote>
                    ),
                    hr: () => <hr className="border-surface-700 my-4" />,
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {isResponding && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 px-2 py-2">
              <span
                className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-4">
            {error.message}
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 pb-6">
        {/* Image Preview */}
        {imagePreview && (
          <div className="relative inline-block mb-3">
            <img
              src={imagePreview}
              alt="preview"
              className="h-20 w-20 object-cover rounded-xl border border-orange-500/30"
            />
            <button
              onClick={clearImage}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#1a1a1e] border border-[#2e2e34] flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              <X size={10} className="text-white" />
            </button>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 bg-surface-800 border border-surface-600 rounded-2xl px-4 py-3 focus-within:border-orange-500/50 focus-within:shadow-[var(--orange-glow)] transition-all duration-200"
        >
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Image upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[#6b6b7b] hover:text-orange-400 transition-colors shrink-0"
            title="Upload image"
          >
            <ImagePlus size={18} />
          </button>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Message OrangeAI..."
            disabled={isResponding}
            className="flex-1 bg-transparent text-white text-sm placeholder-surface-500 focus:outline-none disabled:opacity-50 font-sans"
          />
          <button
            type="submit"
            disabled={isResponding || !input.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0 shadow-[var(--orange-glow)]"
          >
            <ArrowUp size={16} className="text-white" />
          </button>
        </form>
        <p className="text-center text-[10px] text-surface-600 mt-2">
          {process.env.NEXT_PUBLIC_APP_NAME || "OrangeAI"} can make mistakes.
          Verify important info.
        </p>
      </div>
    </div>
  );
}
