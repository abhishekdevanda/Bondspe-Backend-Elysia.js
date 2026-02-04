import Elysia from "elysia";
import { AuthPlugin } from "@/plugins/auth.plugin";
import { createKycSchema, updateKycSchema } from "./kyc.schema";
import { createKyc, getKyc, updateKyc } from "./kyc.handler";

export const userKycRoutes = new Elysia({ prefix: "/user/kyc" })
    .use(AuthPlugin)
    .get("/", ({ user }) => getKyc(user.id), {
        userRole: "user"
    })
    .post("/", ({ body, user }) => createKyc(body, user.id), {
        body: createKycSchema,
        userRole: "user"
    })
    .patch("/", ({ body, user }) => updateKyc(body, user.id), {
        body: updateKycSchema,
        userRole: "user"
    });
