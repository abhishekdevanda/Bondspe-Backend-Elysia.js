import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL as string;
export default defineConfig({
    out: "./src/db/migrations",
    schema: "./src/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: { url },
});
