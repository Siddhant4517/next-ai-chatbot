"use client";

import { useEffect, useRef } from "react";
import { UseChatHelpers } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  chatHelpers: UseChatHelpers;
  chatId: string;
}

export default function ChatWindow({ chatHelpers, chatId }: Props) {
  const { messages, input, handleInputChange, append, status, error,setInput } =
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
    await append(
      { role: "user", content },
      { body: { chatId } }
    );
  }

  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-600 mt-20 text-sm">
            Send a message to start...
          </p>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "user" ? (
              // User message — plain text bubble
              <div className="max-w-[70%] p-3 rounded-2xl text-sm leading-relaxed bg-indigo-600 text-white">
                {m.content}
              </div>
            ) : (
              // AI message — rendered markdown
              <div className="max-w-[70%] p-3 rounded-2xl text-sm leading-relaxed bg-gray-800 text-gray-100 prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Code blocks
                    code({ node, className, children, ...props }) {
                      const isBlock = className?.includes("language-");
                      return isBlock ? (
                        <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto my-2 text-xs">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code
                          className="bg-gray-950 px-1.5 py-0.5 rounded text-xs text-indigo-300"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    // Headings
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold mt-3 mb-1">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-bold mt-3 mb-1">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-semibold mt-2 mb-1">{children}</h3>
                    ),
                    // Lists
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-200">{children}</li>
                    ),
                    // Bold & italic
                    strong: ({ children }) => (
                      <strong className="font-semibold text-white">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-gray-300">{children}</em>
                    ),
                    // Links
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 underline hover:text-indigo-300"
                      >
                        {children}
                      </a>
                    ),
                    // Blockquote
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-indigo-500 pl-3 my-2 text-gray-400 italic">
                        {children}
                      </blockquote>
                    ),
                    // Horizontal rule
                    hr: () => <hr className="border-gray-700 my-3" />,
                    // Paragraph
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
            <div className="bg-gray-800 p-3 rounded-2xl text-sm text-gray-400 flex items-center gap-2">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse delay-75">●</span>
              <span className="animate-pulse delay-150">●</span>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm text-center">{error.message}</p>
        )}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-800 flex gap-3"
      >
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={isResponding || !input.trim()}
          className="px-5 py-3 bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-500 transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}