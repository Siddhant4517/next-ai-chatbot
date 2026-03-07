// App
export const APP_NAME = "AI-Chat-Bot";
export const APP_DESCRIPTION = "Smart conversations powered by AI";

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  CHAT: "/chat",
  CHAT_ID: (id: string) => `/chat/${id}`,
} as const;

// API
export const API = {
  CHAT: "/api/chat",
  CHAT_NEW: "/api/chat/new",
  CHAT_HISTORY: "/api/chat/history",
} as const;

// AI Config
export const AI_CONFIG = {
  MODEL: "gemini-1.5-flash",
  MAX_TITLE_LENGTH: 50,
  TITLE_PROMPT: (message: string) =>
    `Generate a short, meaningful chat title (max 5 words, no quotes, no punctuation) for a conversation that starts with: "${message}"`,
} as const;
