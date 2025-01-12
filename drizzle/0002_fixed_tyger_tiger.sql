CREATE TABLE IF NOT EXISTS "discount_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(256) NOT NULL,
	"discount_percent" integer,
	"discount_amount" integer,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "discount_codes_code_unique" UNIQUE("code")
);
