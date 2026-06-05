/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"IBM Plex Sans Arabic"', 'sans-serif'],
        body: ['Tajawal', 'sans-serif'],
        sans: ['Tajawal', '"IBM Plex Sans Arabic"', 'sans-serif'],
      },
      colors: {
        brand: {
          navy:   '#0A1128',
          black:  '#1C1E21',
          silver: '#E0E1DD',
          steel:  '#415A77',
        },
      },
    },
  },
  plugins: [],
}
