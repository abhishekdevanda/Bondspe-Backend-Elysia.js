import Elysia from "elysia";
import { AuthPlugin } from "@/plugins/auth.plugin";
import { createBlogSchema, getAllBlogsSchema, updateBlogSchema } from "./blogs.schema";
import { createBlog, updateBlog, softDeleteBlog, getAllBlogs, getBlogBySlugOrId } from "./blogs.handler";

export const adminBlogRoutes = new Elysia({ prefix: "/admin/blogs" })
    .use(AuthPlugin)
    .get("/", ({ query }) => getAllBlogs(query), {
        userRole: "admin",
        query: getAllBlogsSchema
    })
    .get("/:slugOrId", ({ params }) => getBlogBySlugOrId(params.slugOrId), {
        userRole: "admin",
    })
    .post("/", ({ body, user }) => createBlog(body, user.id), {
        userRole: "admin",
        body: createBlogSchema
    })
    .patch("/:id", ({ params, body }) => updateBlog(params.id, body), {
        userRole: "admin",
        body: updateBlogSchema
    })
    .delete("/:id", ({ params }) => softDeleteBlog(params.id), {
        userRole: "admin"
    });
