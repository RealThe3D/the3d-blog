import { createHash, timingSafeEqual } from "node:crypto";
import matter from "gray-matter";
import { z } from "zod";
import { clean, slugify } from "./slug-utils";

export const buildNotificationPayload = (
	slug: string,
	frontmatter: Record<string, unknown>,
) => ({
	title:
		typeof frontmatter.title === "string" && frontmatter.title.trim()
			? frontmatter.title
			: "New post published",
	body:
		typeof frontmatter.excerpt === "string" && frontmatter.excerpt.trim()
			? frontmatter.excerpt
			: typeof frontmatter.description === "string" &&
					frontmatter.description.trim()
				? frontmatter.description
				: "New post published",
	url: `/posts/${slugify(clean(slug))}`,
});

type Subscription = { endpoint: string; p256dh: string; auth: string };
type Dependencies = {
	secret: string | undefined;
	loadPost: (slug: string) => Promise<unknown>;
	claim: (slug: string) => Promise<boolean>;
	subscriptions: () => Promise<Subscription[]>;
	send: (subscription: Subscription, payload: string) => Promise<unknown>;
	remove: (endpoint: string) => Promise<unknown>;
	configure: () => void;
	log: (message: string, error: unknown) => void;
};

const bodySchema = z.object({
	slugs: z
		.array(
			z
				.string()
				.min(1)
				.max(200)
				.regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/),
		)
		.min(1)
		.max(100),
});
const authorized = (
	authorization: string | null,
	secret: string | undefined,
) => {
	if (!secret || !authorization) return false;
	const digest = (value: string) => createHash("sha256").update(value).digest();
	return timingSafeEqual(digest(authorization), digest(`Bearer ${secret}`));
};

export const createNotifyHandler =
	(deps: Dependencies) =>
	async (request: Request): Promise<Response> => {
		if (!authorized(request.headers.get("authorization"), deps.secret))
			return new Response("Unauthorized", { status: 401 });
		let body: unknown;
		try {
			body = await request.json();
		} catch {
			return new Response("Invalid JSON", { status: 400 });
		}
		const parsed = bodySchema.safeParse(body);
		if (
			!parsed.success ||
			parsed.data.slugs.some((slug) => !slugify(clean(slug)))
		)
			return new Response("Invalid slugs", { status: 400 });
		try {
			deps.configure();
			const subscriptions = await deps.subscriptions();
			let notified = 0,
				skipped = 0,
				failed = 0;
			const results: { slug: string; status: string }[] = [];
			for (const slug of parsed.data.slugs) {
				try {
					const file = await deps.loadPost(slug);
					if (typeof file !== "string") throw new Error("Post not found");
					const payload = buildNotificationPayload(slug, matter(file).data);
					const canonical = slugify(clean(slug));
					if (!(await deps.claim(canonical))) {
						skipped++;
						results.push({ slug, status: "skipped" });
						continue;
					}
					let sendFailed = false;
					await Promise.all(
						subscriptions.map(async (subscription) => {
							try {
								await deps.send(subscription, JSON.stringify(payload));
							} catch (error) {
								const status =
									error && typeof error === "object" && "statusCode" in error
										? error.statusCode
										: undefined;
								if (status === 404 || status === 410) {
									try {
										await deps.remove(subscription.endpoint);
									} catch (cleanupError) {
										sendFailed = true;
										deps.log("Subscription cleanup failed", cleanupError);
									}
								} else {
									sendFailed = true;
									deps.log("Push delivery failed", error);
								}
							}
						}),
					);
					if (sendFailed) {
						failed++;
						results.push({ slug, status: "delivery_failed" });
					} else {
						notified++;
						results.push({ slug, status: "notified" });
					}
				} catch (error) {
					failed++;
					results.push({ slug, status: "failed" });
					deps.log(`Notification failed for ${slug}`, error);
				}
			}
			return Response.json(
				{ notified, skipped, failed, results },
				{ status: failed ? 500 : 200 },
			);
		} catch (error) {
			deps.log("Notification setup failed", error);
			return new Response("Notification setup failed", { status: 500 });
		}
	};
