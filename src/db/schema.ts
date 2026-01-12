import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, jsonb, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
},
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
},
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
},
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const blogStatusEnum = pgEnum("blog_status", [
  "draft",
  "published",
]);

export const blogs = pgTable("blog", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: jsonb("content").notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  featuredImage: jsonb("featured_image")
    .$type<{ url: string; alt?: string }>()
    .notNull(),
  tags: jsonb("tags")
    .$type<string[]>()
    .default([]),
  seo: jsonb("seo")
    .$type<{
      metaTitle?: string;
      metaDescription?: string;
      slug?: string;
      faqSchema?: string;
      articleSchema?: string;
    }>().notNull(),
  faq: jsonb("faq")
    .$type<{ question: string; answer: string }[]>()
    .default([]),
  definitions: jsonb("definitions")
    .$type<{ term: string; description: string }[]>()
    .default([]),
  status: blogStatusEnum("status").default("draft"),
  isFeatured: boolean("is_featured").default(false),
  isDeleted: boolean("is_deleted").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
},
  (table) => [uniqueIndex("blog_seo_slug_unique").on(sql`(${table.seo}->>'slug')`)]
);

export const kycStatusEnum = pgEnum("kyc_status", [
  "pending",
  "approved",
  "rejected",
]);

export const kyc = pgTable("kyc", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // PAN Card Details
  panCard: jsonb("pan_card").$type<{
    panNumber: string;
    panUrl: string;
  }>().notNull(),

  // Bank Account Details
  bankAccount: jsonb("bank_account").$type<{
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    beneficiaryName: string;
    chequeUrl: string; // URL to Cancelled Cheque image
  }>().notNull(),

  // Demat is mandatory for crediting Bonds
  dematAccount: jsonb("demat_account").$type<{
    dpId: string;       // Depository Participant ID
    clientId: string;   // Client ID
    cmrUrl: string;     // Client Master Report
  }>().notNull(),

  // Minimal compliance flags
  isFatcaCompliant: boolean("is_fatca_compliant").default(true), // User is Indian resident
  isPep: boolean("is_pep").default(false), // User is not Politically Exposed

  // Audit Fields
  updatedById: text("updated_by_id").references(() => user.id),

  status: kycStatusEnum("status").default("pending"),
  remarks: text("remarks"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
},
  (table) => [
    uniqueIndex("kyc_user_id_unique").on(table.userId),
    uniqueIndex("kyc_pan_number_unique").on(sql`(${table.panCard}->>'panNumber')`),
  ]);

// Relations
export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  kyc: one(kyc, {
    fields: [user.id],
    references: [kyc.userId],
    relationName: "user_kyc",
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const kycRelations = relations(kyc, ({ one }) => ({
  user: one(user, {
    fields: [kyc.userId],
    references: [user.id],
    relationName: "user_kyc", // Explicit name to distinguish from audit relations
  }),
  updatedBy: one(user, {
    fields: [kyc.updatedById],
    references: [user.id],
    relationName: "kyc_updated_by",
  }),
}));
