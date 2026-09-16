import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import webpush from "web-push";
import { sql } from "drizzle-orm";
import { createFileRoute } from "@tanstack/react-router";

import { db } from "@/db";
import { pushSubTable } from "@/db/schema";

const getVapidDetails = () => {
  const publicKey = process.env.VITE_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys are not configured");
  }

  webpush.setVapidDetails("https://the3d.vercel.app", publicKey, privateKey);
};

export const Route = createFileRoute("/api/notify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authorization = request.headers.get("authorization");
        if (authorization !== `Bearer ${process.env.NOTIFY_SECRET}`) {
          return new Response("Unauthorized", { status: 401 });
        }

        const body = await request.json();

        getVapidDetails();
        const subscriptions = await db.select().from(pushSubTable);

        for (const slug of body.slugs) {
          const filePath = path.join(
            process.cwd(),
            "content/posts",
            `${slug}.md`,
          );
          const file = await fs.readFile(filePath, "utf8");
          const { data } = matter(file);
          const payload = JSON.stringify({
            title: data.title,
            body: data.excerpt || data.description || "New post published",
            url: `/posts/${slug}`,
          });

          await Promise.all(
            subscriptions.map(async (subscription) => {
              try {
                await webpush.sendNotification(
                  {
                    endpoint: subscription.endpoint,
                    keys: {
                      p256dh: subscription.p256dh,
                      auth: subscription.auth,
                    },
                  },
                  payload,
                );
              } catch (error) {
                if (
                  error &&
                  typeof error === "object" &&
                  "statusCode" in error &&
                  error.statusCode === 410
                ) {
                  await db
                    .delete(pushSubTable)
                    .where(sql`endpoint = ${subscription.endpoint}`);
                }
              }
            }),
          );
        }

        return Response.json({ notified: body.slugs.length });
      },
    },
  },
});
