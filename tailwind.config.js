const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      gray: colors.slate,
      success: colors.emerald,
      danger: colors.rose,
      purple: colors.purple,
      pink: colors.pink,
      transparent: colors.transparent,
      black: colors.black,
      white: colors.white,
    },
    extend: {},
  },
  plugins: [],
};
