import Credentials from "@auth/core/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth, { type NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { users } from "./db/schema";

const CredentialsSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

declare module "next-auth/jwt" {
	interface JWT {
		id?: string | undefined;
	}
}
export default {
	adapter: DrizzleAdapter(db),
	providers: [
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				console.log({ credentials });
				const validatedFields = CredentialsSchema.safeParse(credentials);
				if (!validatedFields.success) {
					return null;
				}
				const { email, password } = validatedFields.data;
				const [user] = await db
					.select()
					.from(users)
					.where(eq(users.email, email));

				if (!user || !user.password) {
					return null;
				}
				const passwordMatch = await bcrypt.compare(password, user.password);

				if (!passwordMatch) {
					return null;
				}
				return user;
			},
		}),
		GitHub,
		Google,
	],
	pages: {
		// redirect /api/auth/signin to /sign-in custom page in (auth) group
		signIn: "/sign-in",
		error: "/sign-in",
	},
	session: {
		strategy: "jwt",
	},
	callbacks: {
		session({ session, token }) {
			if (token.id) {
				session.user.id = token.id;
			}
		},
		jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
	},
} satisfies NextAuthConfig;
