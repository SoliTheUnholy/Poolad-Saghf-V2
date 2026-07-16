import { connectDB } from "@/lib/mongodb";
import User from "@/models/users";
import type { DefaultSession, DefaultUser, NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { DefaultJWT } from "next-auth/jwt";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    role: string;
    name: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    name: string;
  }
}
export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        number: { label: "number", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const rawNumber = String(credentials?.number ?? "").replace(/\D/g, "");
        const normalized = rawNumber.startsWith("98")
          ? `0${rawNumber.slice(2)}`
          : rawNumber.length === 10 && rawNumber.startsWith("9")
            ? `0${rawNumber}`
            : rawNumber;
        const user = await User.findOne({
          number: { $in: [rawNumber, normalized] },
        }).select("+password");
        if (!user) throw new Error("شماره تلفن یا رمز درست نیست");
        const passwordMatch = await bcrypt.compare(
          String(credentials?.password ?? ""),
          user.password,
        );
        if (!passwordMatch) throw new Error("شماره تلفن یا رمز درست نیست");
        return {
          id: String(user._id),
          name: user.name || user.number,
          role: user.role,
          number: user.number,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role;
        session.user.name = token.name;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: { signIn: "/home/login" },
};
