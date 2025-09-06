import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
	path: ".env.local",
});

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dbCredentials: {
		url: process.env.NEXT_PUBLIC_DATABASE_URL!,
	},
	verbose: true,
	strict: true,
});
