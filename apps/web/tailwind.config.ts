import type { Config } from "tailwindcss";
import sharedPreset from "@project_v0/config/tailwind-preset";

const config: Config = {
  presets: [sharedPreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./styles/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  safelist: ["dark"]
};

export default config;

