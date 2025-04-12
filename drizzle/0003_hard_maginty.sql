ALTER TYPE "user_status_enum" ADD VALUE 'Guest';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cheat_sheet" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(256),
	"guest_id" varchar(256),
	"project_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guests" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"guest_session_id" varchar(256),
	"guest_session_signature" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medias" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text,
	"file_key" text,
	"file_name" text,
	"type" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(256),
	"guest_id" varchar(256),
	"project_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" varchar(256),
	"guest_id" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_opened_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "chats" ALTER COLUMN "pdf_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ALTER COLUMN "pdf_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ALTER COLUMN "file_key" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "discount_codes" ALTER COLUMN "id" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "flash_card" ALTER COLUMN "chat_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "flash_card" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "flash_card_set" ALTER COLUMN "chat_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "flash_card_set" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "first_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "trial_end" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "web_url" text;--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "file_type" text;--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "guest_id" varchar(256);--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "project_id" integer;--> statement-breakpoint
ALTER TABLE "discount_codes" ADD COLUMN "value" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "discount_codes" ADD COLUMN "type" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "flash_card" ADD COLUMN "guest_id" varchar(256);--> statement-breakpoint
ALTER TABLE "flash_card_set" ADD COLUMN "guest_id" varchar(256);--> statement-breakpoint
ALTER TABLE "flash_card_set" ADD COLUMN "project_id" integer;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD COLUMN "stripe_promotion_code" varchar(256);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "guest_session_id" varchar(256);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "guest_session_signature" varchar(256);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cheat_sheet" ADD CONSTRAINT "cheat_sheet_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "medias" ADD CONSTRAINT "medias_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chats" ADD CONSTRAINT "chats_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flash_card_set" ADD CONSTRAINT "flash_card_set_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "discount_codes" DROP COLUMN IF EXISTS "discount_percent";--> statement-breakpoint
ALTER TABLE "discount_codes" DROP COLUMN IF EXISTS "discount_amount";