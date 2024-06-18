// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  css: ["~/assets/css/tailwindcss.css"],
  modules: ["@pinia/nuxt", "@nuxtjs/mdc"],
  runtimeConfig: {
    public: {
      NUXT_ENV_API_KEY: process.env.NUXT_ENV_API_KEY,
      NUXT_ENV_PROJECT_ID: process.env.NUXT_ENV_PROJECT_ID,
      NUXT_ENV_API_URL: process.env.NUXT_ENV_API_URL,
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
