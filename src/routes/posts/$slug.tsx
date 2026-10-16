import { createFileRoute } from "@tanstack/react-router";
import { addMinutes, format } from "date-fns";
import { useEffect, useRef } from "react";
import Image from "#/components/Image";
import BackToPosts from "@/components/BackToPosts";
import ProgressBar from "@/components/ProgressBar";
import { loadPost } from "@/lib/postLoader";

export const Route = createFileRoute("/posts/$slug")({
	loader: ({ params }) => loadPost({ data: { title: params.slug } }),
	component: RouteComponent,
	head: ({ loaderData, params }) => ({
		meta: [
			{ title: loaderData?.frontmatter.title },
			{ name: "description", content: loaderData?.frontmatter.description },
			{ property: "og:title", content: loaderData?.frontmatter.title },
			{
				property: "og:description",
				content: loaderData?.frontmatter.description,
			},
			{ property: "og:image", content: loaderData?.frontmatter.cover },
			{
				property: "og:url",
				content: `https://the3d.vercel.app/posts/${params.slug}`,
			},
			{ name: "twitter:title", content: loaderData?.frontmatter.title },
			{
				name: "twitter:description",
				content: loaderData?.frontmatter.description,
			},
			{ name: "twitter:image", content: loaderData?.frontmatter.cover },
			{
				name: "twitter:url",
				content: `https://the3d.vercel.app/posts/${params.slug}`,
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
		],
	}),
});

function RouteComponent() {
	const { frontmatter, html, readTime } = Route.useLoaderData();
	const articleRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!html.includes('class="twitter-tweet"')) return;

		const article = articleRef.current;
		if (!article) return;

		const twitterWindow = window as typeof window & {
			twttr?: {
				widgets?: { load: (root?: HTMLElement) => void };
			};
		};
		const loadWidgets = () => twitterWindow.twttr?.widgets?.load(article);

		if (twitterWindow.twttr?.widgets) {
			loadWidgets();
			return;
		}

		let script = document.querySelector<HTMLScriptElement>(
			'script[src="https://platform.x.com/widgets.js"]',
		);
		if (!script) {
			script = document.createElement("script");
			script.src = "https://platform.x.com/widgets.js";
			script.async = true;
			document.body.appendChild(script);
		}

		script.addEventListener("load", loadWidgets, { once: true });
		return () => script?.removeEventListener("load", loadWidgets);
	}, [html]);

	const postDate = format(
		addMinutes(
			new Date(frontmatter.date),
			new Date(frontmatter.date).getTimezoneOffset(),
		),
		"MMMM d, yyyy",
	);

	return (
		<>
			<ProgressBar />
			<main className="prose dark:prose-stone prose-img:rounded-lg dark:prose-invert mx-auto p-6">
				<BackToPosts />
				<header className="flex flex-col">
					<div className="flex gap-2.5 items-center text-sm py-6">
						<span className="uppercase dark:bg-blue-950 text-blue-950 bg-cyan-400 dark:text-cyan-400 px-3 rounded-2xl text-xs py-1 tracking-wider">
							{frontmatter.categories[0]}
						</span>
						<span className="border-stone-450 dark:border-white/15 border-2 rounded-full" />
						<span className="text-stone-450">{postDate}</span>
						<span className="border-stone-450 dark:border-white/15 border-2 rounded-full" />
						<span className="text-stone-450">{readTime} min read</span>
					</div>
					<h1>{frontmatter.title}</h1>
					<Image
						className="h-80 object-cover border rounded-xl mt-0"
						width={2000}
						src={frontmatter.cover}
						alt="ai generated cover image"
					/>
				</header>
				<article ref={articleRef} dangerouslySetInnerHTML={{ __html: html }} />
				{/* <MDXContent code={post.content} /> */}
				{/* </article> */}
			</main>
		</>
	);
}
