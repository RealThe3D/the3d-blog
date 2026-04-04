import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import ThemeProvider from "@/providers/ThemeProvider";

const DMSans = DM_Sans({ subsets: ["latin"], display: "swap" });
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
      className={`${DMSans.className} ${JetBrainsMono.variable}`}
      data-theme="dark"
    >
      <body className="dark:text-white dark:bg-main-bg">
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
