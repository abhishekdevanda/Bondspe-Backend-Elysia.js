import Elysia from "elysia";
import { blogRoutes } from "./blogs";
import { kycRoutes } from "./kyc";

export const featureRoutes = new Elysia({ prefix: "/api" })
    .use(blogRoutes)
    .use(kycRoutes);
