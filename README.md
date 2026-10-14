# The3D Blog

This is my personal blog, written in TypeScript using TanStack Start!

You'll find me rambling about nonsense here.

# Website Link

[Website Link](https://the3d.vercel.app/)

# Can I use this for myself?

Sure! Remember to update `src/components/Hero.tsx`, `src/components/Navbar.tsx`, `src/routes/__root.tsx` (site metadata and favicon), `content/posts/`, and `public/` as necessary.<br />
You're free to change up the other files and submit a PR for changes I should implement.

# File Structure

- `src/` - The root of the app. Most of the code is here.
- `src/routes/` - Pages and API routes. `__root.tsx` handles the layout and site metadata.
- `src/routeTree.gen.ts` - Generated route tree. Let TanStack handle this one.
- `src/components/` - React components used throughout the project.
- `src/lib/` - Post loading, server functions, helpers, and tests.
- `src/db/` - Database connection and schema for push notifications.
- `src/styles.css` - Styles for the blog.
- `content/posts/` - Markdown posts with YAML frontmatter. The rambling lives here.
- `public/` - Images and the push notification service worker.
- `drizzle/` - Database migrations.
- `.github/workflows/` - Tests and new-post notifications.
- `vite.config.ts` - Build configuration and bundled post/image assets.
- `vitest.config.ts` - Unit test configuration.
