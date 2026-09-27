import { createFileRoute } from "@tanstack/react-router";
import { useStorage } from "nitro/storage";
import sharp from "sharp";

const WIDTHS = [400, 800, 1200, 1600, 2000];
const imageStorage = useStorage("assets:images");

// TODO: Support WebP
export const Route = createFileRoute("/api/image")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const url = new URL(request.url);
				const src = url.searchParams.get("src") ?? "";
				const widthParam = Number(url.searchParams.get("w") ?? 1280); //640;
				const width = Math.min(...WIDTHS.filter((x) => x >= widthParam), 2000);
				const rawImage = await imageStorage.getItemRaw(decodeURIComponent(src));

				if (!rawImage) return new Response("Not found", { status: 404 });

				let image: Buffer<ArrayBuffer>;

				try {
					image = await sharp(rawImage)
						.resize({ width, withoutEnlargement: true })
						.webp({ quality: 80 })
						.toBuffer();
				} catch (e) {
					console.log(e);
					return new Response("Image processing failed", { status: 500 });
				}

				return new Response(image, {
					headers: {
						"content-type": `image/webp`,
						"cache-control":
							"public, max-age=31536000, s-maxage=31536000, immutable",
					},
				});
			},
		},
	},
});
