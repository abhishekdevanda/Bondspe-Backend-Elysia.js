import Elysia from "elysia";
import { featureRoutes } from "./features";
import { AuthPlugin } from "./plugins/auth.plugin";

const app = new Elysia()
  .use(AuthPlugin)
  .use(featureRoutes)

export default app;