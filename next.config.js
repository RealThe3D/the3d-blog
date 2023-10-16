const { withContentlayer } = require("next-contentlayer");
const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true,
  },
};
module.exports = withContentlayer(nextConfig);
