import Elysia from "elysia";
import { getAllBlogsSchema } from "./blogs.schema";
import { getAllBlogs, getBlogBySlugOrId } from "./blogs.handler";

export const userBlogRoutes = new Elysia({ prefix: "/blogs" })
    .get("/", ({ query }) => getAllBlogs(query), getAllBlogsSchema)
    .get("/:slugOrId", ({ params }) => getBlogBySlugOrId(params.slugOrId));
