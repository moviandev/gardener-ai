/** @type {import('tailwindcss').Config} */
module.exports = {
  // Aponta para todos os arquivos dentro de app e components
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'glass-border': 'rgba(255, 255, 255, 0.2)',
        'glass-bg': 'rgba(255, 255, 255, 0.1)',
        'plant-green': {
          DEFAULT: '#10b981', 
          dark: '#064e3b',    
          light: '#d1fae5',   
        }
      },
    },
  },
  plugins: [],
}