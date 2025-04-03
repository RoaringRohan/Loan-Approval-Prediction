/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./src/app/**/*.{js,jsx,ts,tsx}",
      "./src/components/**/*.{js,jsx,ts,tsx}",
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
  };
  