import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
        confirmPassword: { label: "Confirm Password", type: "password" },
        name: { label: "Name", type: "text" },
        mode: { label: "Mode", type: "text" },
      },
      //@ts-ignore
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password");
        }

        const { username, password, confirmPassword, name, mode } = credentials;

        if (mode === "signup") {
          if (!confirmPassword || !name) {
            throw new Error("Missing required fields");
          }
          if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
          }

          const existingUser = await db.user.findUnique({
            where: { username },
          });
          if (existingUser) {
            throw new Error("Username already exists");
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await db.user.create({
            data: {
              username,
              password: hashedPassword,
              name: name,
            },
          });

          return {
            id: newUser.id,
            name: newUser.name,
            username: newUser.username,
          };
        }

        // **Sign-In Logic**
        const user = await db.user.findUnique({ where: { username } });
        if (!user) throw new Error("Invalid credentials");

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) throw new Error("Invalid credentials");

        return { id: user.id, name: user.name, username: user.username };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      },
    },
  },
  pages: {
    signIn: "/signin",
  },
};
