/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode via 'class' strategy
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",     // Adjust these paths if your files are elsewhere
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
