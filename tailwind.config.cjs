/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: "Raleway",
      },
      fontSize: {
        base: "17.4px",
      },
      colors: {
        blue: {
          50: "#E0FFFF",
          100: "#C2FFFF",
          200: "#85FFFF",
          300: "#47FFFF",
          400: "#0AFFFF",
          500: "#00CCCC",
          600: "#00A3A3",
          700: "#007A7A",
          800: "#005252",
          900: "#002929",
          950: "#001414",
        },
        dtGrayBg: "#2f3136",
        dtGrayBg2: "rgb(42, 44, 49)",
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /^col-span-\d+$/,
      variants: ["sm", "md", "lg", "xl", "2xl"],
    },
  ],
};
