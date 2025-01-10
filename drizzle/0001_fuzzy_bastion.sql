CREATE TABLE IF NOT EXISTS "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256),
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"message" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "flash_card" ADD COLUMN "is_known" integer DEFAULT 0;