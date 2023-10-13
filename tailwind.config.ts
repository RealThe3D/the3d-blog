import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // @ts-ignore
      typography: ({ theme }) => ({
        hotpink: {
          css: {
            "--tw-prose-invert-headings": "#FF3366",
            "--tw-prose-invert-body": "#FFFFFF",
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: "class",
};
export default config;
