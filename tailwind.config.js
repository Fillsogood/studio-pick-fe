/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        WarmBeige: {
          100: '#FBF6F0',
          200: '#F5E9DC',
          300: '#E8D8C3',
          DEFAULT: '#DBC4A3',
          500: '#C4AB88',
        },
      },
    },
  },
  plugins: [],
}
