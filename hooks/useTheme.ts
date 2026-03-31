import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    const initialTheme = storedTheme || systemPreference;
    setThemeState(initialTheme);
    htmlElement.setAttribute("data-theme", initialTheme);
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    mounted,
  };
};
