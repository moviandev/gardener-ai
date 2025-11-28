/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'glass-border': 'rgba(255, 255, 255, 0.2)',
        'glass-bg': 'rgba(255, 255, 255, 0.1)',
        'plant-green': {
          DEFAULT: '#10b981', // Emerald 500
          dark: '#064e3b',    // Emerald 900
          light: '#d1fae5',   // Emerald 100
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}