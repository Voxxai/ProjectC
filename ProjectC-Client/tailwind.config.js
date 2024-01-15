/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cavero-purple': '#7F3689',
        'cavero-hover-purple': '#692673',
        'cavero-purple-light': '#f6e0ff',
        'cavero-gold': '#D4AF37',
      },
    },
  },
  variants: {
    extend: {
      scale: ['group-hover'],
    },
  },
  plugins: [],
}

