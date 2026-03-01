import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "./db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

const config = {
  session: { strategy: "jwt" as const },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({
          email: credentials?.email,
        });

        if (!user) {
          throw new Error("User does not exist");
        }

        const isValid = await bcrypt.compare(
          credentials!.password as string,
          user.password,
        );

        if (!isValid) {
          throw new Error("Invalid Credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
