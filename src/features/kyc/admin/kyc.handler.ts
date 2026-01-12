import { db } from "@/lib/db";
import { kyc } from "@/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { InternalServerError, NotFoundError, Static } from "elysia";
import { updateKycStatusSchema } from "./kyc.schema";

type updateKycStatusData = Static<typeof updateKycStatusSchema>;

export const getAllKycs = async ({
    page = 1,
    limit = 10,
    status
}: {
    page?: number;
    limit?: number;
    status?: "pending" | "approved" | "rejected";
}) => {
    try {
        const offset = (page - 1) * limit;
        const whereConditions = [];

        if (status) {
            whereConditions.push(eq(kyc.status, status));
        }

        const whereClause = whereConditions.length ? and(...whereConditions) : undefined;

        const [data, [totalRecord]] = await Promise.all([
            db.query.kyc.findMany({
                where: whereClause,
                limit,
                offset,
                orderBy: [desc(kyc.createdAt)],
                with: {
                    user: {
                        columns: {
                            id: true,
                            name: true,
                            email: true,
                            image: true
                        }
                    }
                }
            }),
            db.select({ count: count() })
                .from(kyc)
                .where(whereClause)
        ]);

        const total = totalRecord?.count || 0;

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error(error);
        throw new InternalServerError();
    }
};

export const getKycById = async (id: string) => {
    try {
        const record = await db.query.kyc.findFirst({
            where: eq(kyc.id, id),
            with: {
                user: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
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

export const updateKycStatus = async (id: string, data: updateKycStatusData, adminId: string) => {
    try {
        const existing = await db.query.kyc.findFirst({
            where: eq(kyc.id, id)
        });

        if (!existing) {
            throw new NotFoundError();
        }

        const [updated] = await db.update(kyc)
            .set({
                status: data.status,
                remarks: data.remarks,
                updatedById: adminId,
                updatedAt: new Date()
            })
            .where(eq(kyc.id, id))
            .returning();

        return updated;
    } catch (error) {
        if (error instanceof NotFoundError) throw error;
        console.error(error);
        throw new InternalServerError();
    }
};
