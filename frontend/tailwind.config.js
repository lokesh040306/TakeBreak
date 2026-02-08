/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        bgDark: "#0f172a",
        cardDark: "#111827",
        textLight: "#e5e7eb",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
