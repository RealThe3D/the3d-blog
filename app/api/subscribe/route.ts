import { db } from "@/lib/db";
import { pushSubTable } from "@/lib/db/schema";

export async function POST(req: Request) {
  const sub = await req.json();

  await db
    .insert(pushSubTable)
    .values({
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    })
    .onConflictDoUpdate({
      target: pushSubTable.endpoint,
      set: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
    });

  return Response.json({ ok: true });
}
