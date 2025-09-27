import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'glowly-pink': '#F79687',
        'glowly-coral': '#F79687',
        'glowly-light-peach': '#FCEBEB',
        'glowly-cream': '#FAF7F5',
      },
      fontFamily: {
        'sofia': ['Sofia Pro', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
