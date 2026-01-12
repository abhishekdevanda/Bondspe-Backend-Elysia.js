import Elysia from "elysia";
import { adminKycRoutes } from "./admin/kyc.routes";
import { userKycRoutes } from "./user/kyc.routes";

export const kycRoutes = new Elysia()
    .use(adminKycRoutes)
    .use(userKycRoutes);
