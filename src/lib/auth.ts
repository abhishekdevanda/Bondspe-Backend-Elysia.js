import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "../db/schema";
import { admin } from "better-auth/plugins";
import { APP_BASE_URL as baseURL } from "../utils/constants/app.constants";

export const auth = betterAuth({
    baseURL,
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }
    },
    plugins: [
        admin({
            defaultRole: "user",
            adminRoles: ["admin"],    
        })
    ]
});
