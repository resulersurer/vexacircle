CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"author_id" text,
	"author_name" text NOT NULL,
	"author_handle" text NOT NULL,
	"author_image" text,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"comments" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;