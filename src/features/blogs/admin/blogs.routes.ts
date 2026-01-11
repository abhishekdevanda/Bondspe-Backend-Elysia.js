import Elysia from "elysia";
import { AuthPlugin } from "@/plugins/auth.plugin";
import { createBlogSchema, updateBlogSchema } from "./blogs.schema";
import { createBlog, updateBlog, softDeleteBlog } from "./blogs.handler";

export const adminBlogRoutes = new Elysia({ prefix: "/admin/blogs" })
    .use(AuthPlugin)
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
