CREATE TABLE "notified_posts" (
	"slug" text PRIMARY KEY,
	"notified_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" serial,
	"endpoint" text NOT NULL UNIQUE,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
