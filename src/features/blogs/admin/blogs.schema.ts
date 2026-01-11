import { t } from "elysia";

export const getAllBlogsSchema = t.Object({
    page: t.Optional(t.Numeric()),
    limit: t.Optional(t.Numeric())
});

export const createBlogSchema = t.Object({
    title: t.String(),
    content: t.Union([
        t.String({ minLength: 1 }), // Plain HTML string
        t.Record(t.String(), t.Unknown(), { minProperties: 1 }) // Rich text JSON object
    ]),
    featuredImage: t.Object({
        url: t.String(),
        alt: t.Optional(t.String())
    }),
    tags: t.Optional(t.Array(t.String())),
    faq: t.Optional(t.Array(t.Object({
        question: t.String(),
        answer: t.String()
    }))),
    definitions: t.Optional(t.Array(t.Object({
        term: t.String(),
        description: t.String()
    }))),
    seo: t.Optional(t.Object({
        metaTitle: t.Optional(t.String()),
        metaDescription: t.Optional(t.String()),
        faqSchema: t.Optional(t.String()),
        articleSchema: t.Optional(t.String())
    })),
    status: t.Optional(t.Union([t.Literal("draft"), t.Literal("published")])),
    isFeatured: t.Optional(t.Boolean()),
});

export const updateBlogSchema = t.Object({
    title: t.Optional(t.String()),
    content: t.Optional(t.Any()),
    featuredImage: t.Optional(t.Object({
        url: t.String(),
        alt: t.Optional(t.String())
    })),
    tags: t.Optional(t.Array(t.String())),
    faq: t.Optional(t.Array(t.Object({
        question: t.String(),
        answer: t.String()
    }))),
    definitions: t.Optional(t.Array(t.Object({
        term: t.String(),
        description: t.String()
    }))),
    seo: t.Optional(t.Object({
        metaTitle: t.Optional(t.String()),
        metaDescription: t.Optional(t.String()),
        faqSchema: t.Optional(t.String()),
        articleSchema: t.Optional(t.String())
    })),
    status: t.Optional(t.Union([t.Literal("draft"), t.Literal("published")])),
    isFeatured: t.Optional(t.Boolean()),
}, {
    minProperties: 1
});
