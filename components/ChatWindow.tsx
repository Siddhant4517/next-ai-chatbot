"use client";

import { useEffect, useRef } from "react";
import { UseChatHelpers } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowUp } from "lucide-react";

interface Props {
  chatHelpers: UseChatHelpers;
  chatId: string;
}

export default function ChatWindow({ chatHelpers, chatId }: Props) {
  const { messages, input, handleInputChange, append, status, error, setInput } =
    chatHelpers;

  const isResponding = status === "streaming" || status === "submitted";
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !chatId || isResponding) return;
    const content = input;
    setInput("");
    await append({ role: "user", content }, { body: { chatId } });
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
              <div className="max-w-[65%] px-4 py-3 rounded-2xl rounded-tr-sm bg-orange-500 text-white text-sm leading-relaxed shadow-[var(--orange-glow)]">
                {m.content}
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
                          <code className={className} {...props}>{children}</code>
                        </pre>
                      ) : (
                        <code className="bg-surface-800 border border-surface-700 px-1.5 py-0.5 rounded text-xs text-orange-300" {...props}>
                          {children}
                        </code>
                      );
                    },
                    h1: ({ children }) => <h1 className="font-display text-lg font-bold mt-4 mb-1 text-white">{children}</h1>,
                    h2: ({ children }) => <h2 className="font-display text-base font-bold mt-3 mb-1 text-white">{children}</h2>,
                    h3: ({ children }) => <h3 className="font-display text-sm font-semibold mt-2 mb-1 text-white">{children}</h3>,
                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-300">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-orange-300">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-400">{children}</em>,
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-orange-400 underline underline-offset-2 hover:text-orange-300 transition-colors">
                        {children}
                      </a>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-orange-500/50 pl-3 my-2 text-gray-400 italic">
                        {children}
                      </blockquote>
                    ),
                    hr: () => <hr className="border-surface-700 my-4" />,
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
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
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "300ms" }} />
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
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 bg-surface-800 border border-surface-600 rounded-2xl px-4 py-3 focus-within:border-orange-500/50 focus-within:shadow-[var(--orange-glow)] transition-all duration-200"
        >
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
          {process.env.NEXT_PUBLIC_APP_NAME || "OrangeAI"} can make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
}