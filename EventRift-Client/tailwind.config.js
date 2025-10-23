/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            // Inspired by the dark UI of the screenshots
            'er-dark': '#0f0f0f', 
            'er-primary': '#E30B5C', // A bold color for accents
            'er-light': '#f5f5f5',
        },
        fontFamily: {
            // Use a modern, bold font if available, or fall back to system sans-serif
            sans: ['Inter', 'sans-serif'], 
        }
    },
  },
  plugins: [],
}

