import { db } from "@/lib/db";
import { kyc } from "@/db/schema";
import { eq } from "drizzle-orm";
import { InternalServerError, NotFoundError, Static } from "elysia";
import { ConflictError } from "@/utils/errors";
import { createKycSchema, updateKycSchema } from "./kyc.schema";

type createKycData = Static<typeof createKycSchema>;
type updateKycData = Static<typeof updateKycSchema>;

export const createKyc = async (data: createKycData, userId: string) => {
    try {
        const existingKyc = await db.query.kyc.findFirst({
            where: eq(kyc.userId, userId)
        });

        if (existingKyc) {
            throw new ConflictError("KYC already exists for this user");
        }

        const id = crypto.randomUUID();

        const [record] = await db.insert(kyc).values({
            id,
            userId,
            ...data,

        }).returning();

        return record;
    } catch (error) {
        if (error instanceof ConflictError) throw error;
        console.error(error);
        throw new InternalServerError();
    }
};

export const getKyc = async (userId: string) => {
    try {
        const record = await db.query.kyc.findFirst({
            where: eq(kyc.userId, userId)
        });

        if (!record) {
            throw new NotFoundError();
        }

        return record;
    } catch (error) {
        if (error instanceof NotFoundError) throw error;
        console.error(error);
        throw new InternalServerError();
    }
};

export const updateKyc = async (data: updateKycData, userId: string) => {
    try {
        const existingKyc = await db.query.kyc.findFirst({
            where: eq(kyc.userId, userId)
        });

        if (!existingKyc) {
            throw new NotFoundError();
        }

        // Optional: restrict updates if verified
        if (existingKyc.status === 'approved') {
            throw new ConflictError("Cannot update approved KYC");
        }

        const [updatedRecord] = await db.update(kyc)
            .set({
                ...data,
                updatedAt: new Date()
            })
            .where(eq(kyc.id, existingKyc.id))
            .returning();

        return updatedRecord;
    } catch (error) {
        if (error instanceof NotFoundError) throw error;
        if (error instanceof ConflictError) throw error;
        console.error(error);
        throw new InternalServerError();
    }
};
