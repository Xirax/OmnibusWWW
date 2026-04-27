/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#8e7f43",
        "accent-light": "#b5a45a",
        primary: "#1D1E1F",
        "primary-light": "#333230",
        secondary: "#FFFFFF",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        body: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
