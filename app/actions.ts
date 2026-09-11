"use server";

import webpush from "web-push";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { pushSubTable } from "@/lib/db/schema";

type SerializedPushSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (!vapidPublicKey || !vapidPrivateKey) {
  throw new Error("VAPID keys are not configured");
}

webpush.setVapidDetails(
  "https://the3d.vercel.app",
  vapidPublicKey,
  vapidPrivateKey,
);

export const subscribeUser = async (sub: SerializedPushSubscription) => {
  await db
    .insert(pushSubTable)
    .values({
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    })
    .onConflictDoUpdate({
      target: pushSubTable.endpoint,
      set: {
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      },
    });

  return { success: true };
};

export const unsubscribeUser = async (endpoint: string) => {
  await db.delete(pushSubTable).where(eq(pushSubTable.endpoint, endpoint));

  return { success: true };
};

export const sendNotification = async (message: string) => {
  const subscriptions = await db.select().from(pushSubTable);

  if (subscriptions.length === 0) {
    throw new Error("No subscription available");
  }

  const payload = JSON.stringify({
    title: "Test Notification",
    body: message,
    icon: "/icon.png",
  });

  try {
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
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
};
