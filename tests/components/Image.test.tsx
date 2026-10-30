import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import Image from "@/components/Image";

it("offers thumbnail-sized responsive image variants", () => {
	const html = renderToStaticMarkup(
		<Image src="/cover.jpg" width={80} alt="Cover" className="thumbnail" />,
	);
	expect(html).toContain("/api/image?src=cover.jpg&amp;w=80 80w");
	expect(html).toContain("/api/image?src=cover.jpg&amp;w=160 160w");
	expect(html).toContain('sizes="80px"');
});
