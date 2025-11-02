/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Add any custom theme extensions here
    },
  },
  plugins: [],
  // Add this to ensure gradient classes are properly recognized
  safelist: [
    "bg-gradient-to-br",
    "from-background",
    "via-background",
    "to-muted",
    "from-primary",
    "to-purple-600",
  ],
};
