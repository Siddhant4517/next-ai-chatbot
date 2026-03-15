import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Chat } from "@/models/Chat";
import ChatLayout from "@/components/ChatLayout";
import { ROUTES } from "@/lib/constants";

export const metadata = { title: `${process.env.NEXT_PUBLIC_APP_NAME ?? "OrangeAI"} | Home` };

export default function Home() {
  redirect("/new");
}