import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'sm': '576px',
      // => @media (min-width: 576px) { ... }

      'md': '960px',
      // => @media (min-width: 960px) { ... }

      'lg': '1440px',
      // => @media (min-width: 1440px) { ... }
    },
    extend: {
      colors: {
        'sdt-black': '#252525',
        'sdt-orange': '#D04A02',
        'sdt-border': "var(--sdt-border-color)",
        'sdt-grey-dark': "var(--sdt-grey-dark)",
        'sdt-yellow': '#FFBF1F',
        'sdt-green': '#4EAD58',
        'sdt-red': '#C52A1A',
        'sdt-black-light': '#474747',
        'sdt-border-light': '#D9D9D9',
      },
    },
  },
  plugins: [],
};
export default config;