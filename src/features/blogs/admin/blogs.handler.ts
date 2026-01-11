import { db } from "@/lib/db";
import { blogs } from "@/db/schema";
import { and, eq, type InferInsertModel } from "drizzle-orm";
import { InternalServerError, NotFoundError, Static } from "elysia";

import { generateSlug } from "@/utils/helpers/slug";
import { createBlogSchema, updateBlogSchema } from "./blogs.schema";

type createBlogData = Static<typeof createBlogSchema>;
type updateBlogData = Static<typeof updateBlogSchema>;

export const createBlog = async (data: createBlogData, userId: string) => {
    try {
        const slug = generateSlug(data.title);
        const id = crypto.randomUUID();
        const [blog] = await db.insert(blogs).values({
            id,
            authorId: userId,
            ...data,
            seo: {
                ...data.seo,
                slug
            }
        }).returning();

        return blog;
    } catch (error) {
        console.error(error);
        throw new InternalServerError();
    }
};

export const updateBlog = async (id: string, data: updateBlogData) => {
    try {
        const existingBlog = await db.query.blogs.findFirst({
            where: and(
                eq(blogs.id, id),
                eq(blogs.isDeleted, false)
            )
        });

        if (!existingBlog) {
            throw new NotFoundError();
        }

        const updateData: Partial<InferInsertModel<typeof blogs>> = {
            ...data,
        };

        if (data.title !== undefined && data.title !== existingBlog.title) {
            const newSlug = generateSlug(data.title);

            // Safe Merge: Keep existing SEO, overwrite with new slug
            updateData.seo = {
                ...existingBlog.seo,
                ...data.seo,
                slug: newSlug
            };
        } else if (data.seo) {
            // Update SEO without title change
            updateData.seo = {
                ...existingBlog.seo,
                ...data.seo
            };
        }

        const [updatedBlog] = await db.update(blogs)
            .set(updateData)
            .where(eq(blogs.id, id))
            .returning();

        return updatedBlog;
    } catch (error) {
        if (error instanceof NotFoundError) throw error;
        console.error(error);
        throw new InternalServerError();
    }
};

export const softDeleteBlog = async (id: string) => {
    try {
        const [blog] = await db.update(blogs)
            .set({ isDeleted: true })
            .where(and(
                eq(blogs.id, id),
                eq(blogs.isDeleted, false),
            ))
            .returning();

        if (!blog) throw new NotFoundError();
        return { success: true, id };
    } catch (error) {
        if (error instanceof NotFoundError) throw error;
        console.error(error);
        throw new InternalServerError();
    }
};
