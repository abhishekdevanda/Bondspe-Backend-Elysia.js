import { t } from "elysia";

export const updateKycStatusSchema = t.Object({
    status: t.Union([t.Literal("approved"), t.Literal("rejected")]),
    remarks: t.Optional(t.String())
});

export const getAllKycsQuerySchema = t.Object({
    page: t.Optional(t.Numeric()),
    limit: t.Optional(t.Numeric()),
    status: t.Optional(t.Union([t.Literal("pending"), t.Literal("approved"), t.Literal("rejected")]))
});
