/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'neumorphic': '8px 8px 16px #d1d9e6, -8px -8px 16px white',
      },
      colors: {
        'light-bg': '#e0e5ec78',
        'light-text': '#6b7280',
      },
    },
  },
  plugins: [],
};
