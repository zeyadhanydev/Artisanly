import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { db } from "@/db/drizzle";
export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: DrizzleAdapter(db),
	providers: [GitHub],
	pages: {
		// redirect /api/auth/signin to /sign-in custom page in (auth) group
		signIn: "/sign-in",
	},
});
