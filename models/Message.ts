import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    chatId: { type: String, required: true, index: true },
    role: { type: String, enum: ["user", "assistant"] },
    content: String,
    imageBase64: { type: String, default: null },
    imageMimeType: { type: String, default: null },
  },
  { timestamps: true },
);

export const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
