import { t } from "elysia";

export const createKycSchema = t.Object({
    panCard: t.Object({
        panNumber: t.String({
            minLength: 10,
            maxLength: 10,
            pattern: "^[A-Z]{5}[0-9]{4}[A-Z]$"
        }),
        panUrl: t.String({ format: "uri" })
    }),
    bankAccount: t.Object({
        accountNumber: t.String(),
        ifscCode: t.String({ minLength: 11, maxLength: 11, pattern: "^[A-Z]{4}0[A-Z0-9]{6}$" }),
        bankName: t.String(),
        beneficiaryName: t.String(),
        chequeUrl: t.String({ format: "uri" })
    }),
    dematAccount: t.Object({
        dpId: t.String(),
        clientId: t.String(),
        cmrUrl: t.String({ format: "uri" })
    }),
    isFatcaCompliant: t.Optional(t.Boolean()),
    isPep: t.Optional(t.Boolean())
});

export const updateKycSchema = t.Partial(createKycSchema);
