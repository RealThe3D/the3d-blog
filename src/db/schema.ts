import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const pushSubTable = pgTable("push_subscriptions", {
  id: serial(),
  endpoint: text().unique().notNull(),
  p256dh: text().notNull(),
  auth: text().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifiedPostsTable = pgTable("notified_posts", {
  slug: text().primaryKey(),
  notifiedAt: timestamp("notified_at").defaultNow(),
});
