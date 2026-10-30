import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { pushSubTable } from "@/db/schema";

type SerializedPushSubscription = {
	endpoint: string;
	keys: { p256dh: string; auth: string };
};

const serializedPushSubscriptionSchema = z.object({
	endpoint: z.url(),
	keys: z.object({
		p256dh: z.string().min(1),
		auth: z.string().min(1),
	}),
});

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
		await db.delete(pushSubTable).where(eq(pushSubTable.endpoint, data));

		return { success: true };
	});

export type { SerializedPushSubscription };
