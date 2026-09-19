import { createFileRoute } from "@tanstack/react-router";
import AllBlogs from "@/components/AllBlogs";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { getAllPosts } from "@/lib/postLoader";

export const Route = createFileRoute("/")({
	loader: async () => {
		return getAllPosts();
	},
	head: () => ({
		meta: [
			{ title: "The3D" },
			{ property: "og:title", content: "The3D's Blog" },
			{ property: "og:image", content: "/proto_mirage_pfp.jpg" },
			{
				property: "og:description",
				content: "A blog site made by The3D.",
			},
			{
				property: "og:url",
				content: `https://the3d.vercel.app`,
			},
			{ name: "twitter:title", content: "The3D's Blog" },
			{
				name: "twitter:description",
				content: "A blog site made by The3D",
			},
			{ name: "twitter:image", content: "/proto_mirage_pfp.jpg" },
			{
				name: "twitter:url",
				content: `https://the3d.vercel.app/`,
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
		],
	}),
	component: Home,
});

function Home() {
	const posts = Route.useLoaderData();

	return (
		<>
			<Hero />
			<AllBlogs posts={posts} />
			<Footer />
		</>
	);
}
