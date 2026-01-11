import { t } from "elysia";

export const getAllBlogsSchema = t.Object({
    page: t.Optional(t.Numeric()),
    limit: t.Optional(t.Numeric())
})
