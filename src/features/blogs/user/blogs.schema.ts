import { t } from "elysia";

export const getAllBlogsSchema = {
    query: t.Object({
        page: t.Optional(t.Numeric()),
        limit: t.Optional(t.Numeric())
    })
}
