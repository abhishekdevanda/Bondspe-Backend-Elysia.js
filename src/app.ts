import Elysia from "elysia";
import { AuthPlugin } from "./plugins/auth.plugin";

const app = new Elysia()
  .use(AuthPlugin)
  .get("/user", ({ user }) => user, {
    auth: true,
  })
  .get("/admin", ({ user }) => user, {
    adminOnly: true,
  })

export default app;