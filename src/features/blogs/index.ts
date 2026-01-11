import Elysia from "elysia";
import { adminBlogRoutes } from "./admin/blogs.routes";
import { userBlogRoutes } from "./user/blogs.routes";

export const blogRoutes = new Elysia()
    .use(adminBlogRoutes)
    .use(userBlogRoutes);
