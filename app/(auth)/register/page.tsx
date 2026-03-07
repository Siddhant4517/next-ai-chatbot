import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterClient from "./Register";

export const metadata = { title: `Register` };

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return <RegisterClient />;
}