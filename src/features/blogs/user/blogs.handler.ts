import { db } from "@/lib/db";
import { blogs } from "@/db/schema";
import { or, sql, eq, and, desc } from "drizzle-orm";
import { InternalServerError, NotFoundError } from "elysia";

export const getAllBlogs = async ({
    page = 1,
    limit = 10,
}: {
    page?: number;
    limit?: number;
}) => {
    try {
        const offset = (page - 1) * limit;
        const whereConditions = [
            eq(blogs.status, "published"),
            eq(blogs.isDeleted, false)
        ];

        const data = await db.query.blogs.findMany({
            where: and(...whereConditions),
            limit,
            offset,
            orderBy: [desc(blogs.createdAt)]
        });

        return data;
    } catch (error) {
        console.error(error);
        throw new InternalServerError;
    }
};

export const getBlogBySlugOrId = async (slug: string) => {
    try {
        const blog = await db.query.blogs.findFirst({
            where: and(
                or(
                    sql`${blogs.seo}->>'slug' = ${slug}`,
                    eq(blogs.id, slug)
                ),
                eq(blogs.status, "published"),
                eq(blogs.isDeleted, false)
            )
        });
        if (!blog) {
            throw new NotFoundError;
        }
        return blog;
    } catch (error) {
        if (error instanceof NotFoundError) throw error;
        console.error(error);
        throw new InternalServerError;
    }
};
