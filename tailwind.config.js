/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        josefin: ["Josefin Sans", "sans-serif"],
        lato: ["Lato", "sans-serif"],
      },
      colors: {
        hpurple: "#7e33e0",
        hpink: "#fb2e86",
        hdark: "#151875",
        hlight: "#f2f0ff",
      },
    },
  },
  plugins: [],
};
