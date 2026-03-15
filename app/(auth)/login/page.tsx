import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginClient from "./Login";
import { ROUTES } from "@/lib/constants";

export const metadata = { title: `Login` };

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect(ROUTES.HOME);
  }

  return <LoginClient />;
}