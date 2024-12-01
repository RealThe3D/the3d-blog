import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const JetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "The3D's Blog",
  description: "Blog created by The3D.",
  other: {
    "google-site-verification": "ab4DR7xw7N4pxI0hFF41ko_Iw81BtYo967wKbsfpAgc",
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
