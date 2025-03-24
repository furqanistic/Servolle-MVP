/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    // Add other paths where you use Tailwind classes
  ],
  theme: {
    extend: {
      colors: {
        app: {
          base: '#0b1425', // Main background color of app
          medium: '#0b172f', // Medium shade
          deep: '#0b1121', // Deepest shade
          lite: '#00a6f4', // light sky blue shade
        },
      },
      fontFamily: {
        montserrat: ['"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
