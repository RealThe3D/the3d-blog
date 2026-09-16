import { createFileRoute } from "@tanstack/react-router";
import AllBlogs from "@/components/AllBlogs";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { getAllPosts } from "@/lib/postLoader";

export const Route = createFileRoute("/")({
  loader: async () => {
    return getAllPosts();
  },
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
