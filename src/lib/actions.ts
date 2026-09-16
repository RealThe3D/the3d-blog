import webpush from "web-push";
import { eq } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { db } from "@/db";
import { pushSubTable } from "@/db/schema";

type SerializedPushSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

const serializedPushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

function configureWebPush() {
  if (!vapidPublicKey || !vapidPrivateKey) {
    throw new Error("VAPID keys are not configured");
  }

  webpush.setVapidDetails(
    "https://the3d.vercel.app",
    vapidPublicKey,
    vapidPrivateKey,
  );
}

export const subscribeUser = createServerFn({ method: "POST" })
  .validator(serializedPushSubscriptionSchema)
  .handler(async ({ data }) => {
    await db
      .insert(pushSubTable)
      .values({
        endpoint: data.endpoint,
        p256dh: data.keys.p256dh,
        auth: data.keys.auth,
      })
      .onConflictDoUpdate({
        target: pushSubTable.endpoint,
        set: { p256dh: data.keys.p256dh, auth: data.keys.auth },
      });

    return { success: true };
  });

export const unsubscribeUser = createServerFn({ method: "POST" })
  .validator(z.string().url())
  .handler(async ({ data }) => {
    await db
      .delete(pushSubTable)
      .where(eq(pushSubTable.endpoint, data.endpoint));

    return { success: true };
  });

export const sendNotification = createServerFn({ method: "POST" })
  .validator(z.object({ message: z.string().min(1) }))
  .handler(async ({ data }) => {
    configureWebPush();
    const subscriptions = await db.select().from(pushSubTable);

    if (subscriptions.length === 0) {
      throw new Error("No subscription available");
    }

    const payload = JSON.stringify({
      title: "Test Notification",
      body: data.message,
      icon: "/icon.png",
    });

    await Promise.all(
      subscriptions.map((sub) =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload,
        ),
      ),
    );

    return { success: true };
  });

export type { SerializedPushSubscription };
