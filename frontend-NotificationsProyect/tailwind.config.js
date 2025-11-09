/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",  // 👈 MUY IMPORTANTE
  ],
  theme: {
    extend: {
    fontFamily: {
      serif: ['"Noto Serif"', 'serif'],
      sans: ['"Noto Serif"', 'serif'], // opcional: reemplaza la sans por Noto Serif
    },
  },
  },
  plugins: [],
}
