import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
const preset = {
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1320px"
      }
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#4E5DFF",
          foreground: "#ffffff"
        },
        accent: {
          DEFAULT: "#D4AF37",
          foreground: "#1f2933"
        }
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
        headline: ["'Clash Display'", "serif"]
      },
      boxShadow: {
        soft: "0 15px 35px -15px rgba(79, 70, 229, 0.35)"
      }
    }
  },
  plugins: [typography, forms]
};

export default preset;

