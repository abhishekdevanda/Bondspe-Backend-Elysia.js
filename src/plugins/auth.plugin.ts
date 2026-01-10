import { Elysia } from "elysia";
import { auth } from "../lib/auth";

const betterAuth = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) return status(401);

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
    adminOnly: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) return status(401);

       if (session.user.role !== "admin") {
					return status(403, { error: `admin role required` });
				}

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });

export const AuthPlugin = betterAuth;