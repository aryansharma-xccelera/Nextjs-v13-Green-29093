import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        "primary-dark": "#1d4ed8",
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
        income: "#10b981",
        expense: "#ef4444",
        surface: "#f9fafb",
        card: "#f3f4f6",
        border: "#e5e7eb",
        "text-secondary": "#4b5563",
        "text-primary": "#111827",
      },
      borderRadius: {
        card: "12px",
        input: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
