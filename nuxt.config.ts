// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  css: ["~/assets/css/tailwindcss.css"],
  modules: ["@pinia/nuxt", "@nuxtjs/mdc"],
  runtimeConfig: {
    public: {
      NUXT_ENV_API_KEY: process.env.NUXT_ENV_API_KEY,
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
