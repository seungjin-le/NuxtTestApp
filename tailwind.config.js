/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{html,js,vue}",
    "./components/**/*.{html,js,vue}",
    "./layouts/**/*.{html,js,vue}",
    "./plugins/**/*.{html,js,vue}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
