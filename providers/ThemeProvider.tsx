"use client";
import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme) {
      htmlElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return <>{children}</>;
}
