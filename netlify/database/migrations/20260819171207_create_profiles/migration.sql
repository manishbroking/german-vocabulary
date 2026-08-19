CREATE TABLE "profiles" (
	"user_id" text PRIMARY KEY,
	"vocab_list" jsonb DEFAULT '[]' NOT NULL,
	"stats" jsonb DEFAULT '{}' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
