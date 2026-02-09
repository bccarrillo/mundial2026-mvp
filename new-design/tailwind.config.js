/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './new-design/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#ec1313',
        'background-light': '#f8f6f6',
        'background-dark': '#181111',
        'mexico-green': '#006847',
        'usa-blue': '#002147',
        'gold-vip': '#FFD700',
        'text-dark': '#181111',
        'text-muted': '#555555',
      },
      fontFamily: {
        'display': ['Spline Sans', 'sans-serif']
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px'
      },
    },
  },
  plugins: [],
}