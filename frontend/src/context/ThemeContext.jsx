// src/context/ThemeContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);

const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";

  const stored = localStorage.getItem("theme");
  if (stored) return stored;

  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)"
  ).matches;

  return prefersDark ? "dark" : "light";
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");

    try {
      localStorage.setItem("theme", theme);
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = useMemo(
    () => ({ theme, toggleTheme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};
