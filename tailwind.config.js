/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      colors: {
        gold: {
          500: '#f59e0b',
          600: '#d97706',
        },
        wa: {
          emerald: '#10b981',
          dark: '#0b141a',
          bubbleSent: '#005c4b',
          bubbleReceived: '#202c33'
        }
      }
    },
  },
  plugins: [],
}
