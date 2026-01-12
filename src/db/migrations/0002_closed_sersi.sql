CREATE TYPE "public"."kyc_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "kyc" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"pan_card" jsonb NOT NULL,
	"bank_account" jsonb NOT NULL,
	"demat_account" jsonb NOT NULL,
	"is_fatca_compliant" boolean DEFAULT true,
	"is_pep" boolean DEFAULT false,
	"updated_by_id" text,
	"status" "kyc_status" DEFAULT 'pending',
	"remarks" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog" ALTER COLUMN "seo" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "kyc" ADD CONSTRAINT "kyc_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kyc" ADD CONSTRAINT "kyc_updated_by_id_user_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "kyc_user_id_unique" ON "kyc" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "kyc_pan_number_unique" ON "kyc" USING btree (("pan_card"->>'panNumber'));--> statement-breakpoint
CREATE UNIQUE INDEX "blog_seo_slug_unique" ON "blog" USING btree (("seo"->>'slug'));