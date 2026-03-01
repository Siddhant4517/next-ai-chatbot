import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

     if (!parsed.success) {
      return Response.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }
    await connectDB();

    const existing = await User.findOne({ email: parsed.data.email });
    if (existing) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(parsed.data.password, 10);

    const user = await User.create({
      ...parsed.data,
      password: hashed,
    });

    return Response.json(user);
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return Response.json({ error: "Error" }, { status: 500 });
  }
}