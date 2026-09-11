import webpush from "web-push";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { db } from "@/lib/db";
import { pushSubTable, notifiedPostsTable } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

webpush.setVapidDetails(
  "https://the3d.vercel.app",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.NOTIFY_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { slugs } = await req.json();
  const subscriptions = await db.select().from(pushSubTable);

  for (const slug of slugs) {
    const filePath = path.join(process.cwd(), "content/posts", `${slug}.mdx`);
    const { data } = matter(fs.readFileSync(filePath, "utf8"));

    const payload = JSON.stringify({
      title: data.title,
      body: data.excerpt || "New post published",
      url: `/blog/${slug}`,
    });

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          payload,
        );
      } catch (err) {
        // @ts-ignore
        if (err.statusCode === 410) {
          db.delete(pushSubTable).where(sql`endpoint = ${sub.endpoint}`);
        }
      }
    }
  }

  return Response.json({ notified: slugs.length });
}
