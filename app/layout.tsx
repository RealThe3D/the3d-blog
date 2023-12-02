import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "node_modules/highlight.js/styles/github-dark.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const JetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "The3D's Blog",
  description: "Blog created by The3D.",
  other: {
    "google-site-verification": "_-QgjympglxSEiv2QGImscY8Q5bMz4IWBtjM1LxsT_k",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${JetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="p-4">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
