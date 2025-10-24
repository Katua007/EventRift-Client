/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'er-primary': '#ff6b9d',
        'er-secondary': '#4ecdc4', 
        'er-accent': '#ffd93d',
        'er-dark': '#0a0a0a',
        'er-gray': '#1a1a1a',
        'er-light': '#ffffff',
        'er-text': '#e5e5e5',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}