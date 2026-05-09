/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: '#161616',
        border: '#2a2a2a',
        accent: '#7c6af7',
        success: '#4ade80',
        danger: '#f87171',
      },
    },
  },
  plugins: [],
}

