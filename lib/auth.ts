import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "./db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { ROUTES } from "./constants";

const config = {
  session: { strategy: "jwt" as const },
  trustHost: true,

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

  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id as string;
      return session;
    },
  },

  pages: {
    signIn: ROUTES.LOGIN,
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
