import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { useStorage as storageForPosts } from "nitro/storage";
import webpush from "web-push";
import { db } from "@/db";
import { notifiedPostsTable, pushSubTable } from "@/db/schema";
import { createNotifyHandler } from "@/lib/notification";

export const Route = createFileRoute("/api/notify")({
	server: {
		handlers: {
			POST: async ({ request }) =>
				createNotifyHandler({
					secret: process.env.NOTIFY_SECRET,
					loadPost: (slug) =>
						storageForPosts("assets:posts").getItem(`${slug}.md`),
					claim: async (slug) => {
						const rows = await db
							.insert(notifiedPostsTable)
							.values({ slug })
							.onConflictDoNothing()
							.returning({ slug: notifiedPostsTable.slug });
						return rows.length > 0;
					},
					subscriptions: () => db.select().from(pushSubTable),
					configure: () => {
						const publicKey = process.env.VITE_PUBLIC_VAPID_PUBLIC_KEY;
						const privateKey = process.env.VAPID_PRIVATE_KEY;
						if (!publicKey || !privateKey)
							throw new Error("VAPID keys are not configured");
						webpush.setVapidDetails(
							"https://the3d.vercel.app",
							publicKey,
							privateKey,
						);
					},
					send: (subscription, payload) =>
						webpush.sendNotification(
							{
								endpoint: subscription.endpoint,
								keys: { p256dh: subscription.p256dh, auth: subscription.auth },
							},
							payload,
						),
					remove: (endpoint) =>
						db.delete(pushSubTable).where(eq(pushSubTable.endpoint, endpoint)),
					log: (message, error) => console.error(message, error),
				})(request),
		},
	},
});
