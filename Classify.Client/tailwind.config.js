/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        cibc: {
          maroon: '#C41230',
          white: '#FFFFFF',
          slate: '#333333',
          'slate-light': '#F3F4F6' // Adding a light slate for backgrounds if needed
        }
      }
    },
  },
  plugins: [],
}

