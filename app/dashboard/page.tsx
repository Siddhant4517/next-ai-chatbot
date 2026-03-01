import LogoutButton from "@/components/LogoutButton";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
     <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 text-white">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center p-6">
        <h1 className="text-xl font-semibold">
          AI-Chat-Bot
        </h1>

        <LogoutButton />
      </div>

      {/* Content */}
      <div className="p-10">
        <h2 className="text-2xl font-bold">
          Welcome, {session.user.name}
        </h2>
      </div>
    </div>
  );
}