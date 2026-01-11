import { Elysia } from "elysia";
import { auth } from "@/lib/auth";
import { UnauthorizedError } from "@/utils/errors";

const betterAuth = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
    userRole: (role: 'user' | 'admin') => ({
      async resolve({ request: { headers } }) {
        const session = await auth.api.getSession({ headers });
        if (!session) throw new UnauthorizedError("Unauthorized");
        
        if (session.user.role !== role) throw new UnauthorizedError(`${role} role required`);
        
        return {
            user: session.user,
            session: session.session,
        };
      }
    })
})

export const AuthPlugin = betterAuth;