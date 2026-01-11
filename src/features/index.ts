import Elysia from "elysia";
import { blogRoutes } from "./blogs";

export const featureRoutes = new Elysia({ prefix: "/api" })
    .use(blogRoutes);
