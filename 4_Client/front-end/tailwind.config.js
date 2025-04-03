/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,jsx,ts,tsx}", // include the new app directory
      "./components/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          ocean: {
            light: "#a3d8f4",
            DEFAULT: "#3fa9f5",
            dark: "#2a8cc4",
          },
        },
      },
    },
    plugins: [],
  }
  