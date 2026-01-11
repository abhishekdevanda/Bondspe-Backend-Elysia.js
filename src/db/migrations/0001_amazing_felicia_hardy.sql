CREATE TYPE "public"."blog_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "blog" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" jsonb NOT NULL,
	"author_id" text NOT NULL,
	"featured_image" jsonb NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"seo" jsonb,
	"faq" jsonb DEFAULT '[]'::jsonb,
	"definitions" jsonb DEFAULT '[]'::jsonb,
	"status" "blog_status" DEFAULT 'draft',
	"is_featured" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;