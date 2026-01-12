import Elysia from "elysia";
import { AuthPlugin } from "@/plugins/auth.plugin";
import { updateKycStatusSchema, getAllKycsQuerySchema } from "./kyc.schema";
import { getAllKycs, getKycById, updateKycStatus } from "./kyc.handler";

export const adminKycRoutes = new Elysia({ prefix: "/admin/kyc" })
    .use(AuthPlugin)
    .get("/", ({ query }) => getAllKycs(query), {
        userRole: "admin",
        query: getAllKycsQuerySchema
    })
    .get("/:id", ({ params }) => getKycById(params.id), {
        userRole: "admin"
    })
    .patch("/:id/status", ({ params, body, user }) => updateKycStatus(params.id, body, user.id), {
        userRole: "admin",
        body: updateKycStatusSchema
    });
