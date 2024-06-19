// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  css: ["~/assets/css/tailwindcss.css"],
  modules: ["@pinia/nuxt", "@nuxtjs/mdc", "@hebilicious/vue-query-nuxt"],
  runtimeConfig: {
    public: {
      NUXT_ENV_API_KEY: process.env.NUXT_ENV_API_KEY,
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  vueQuery: {
    stateKey: "vue-query-nuxt",
    autoImports: [
      "useQuery",
      "useQueries",
      "useInfiniteQuery",
      "useMutation",
      "useIsFetching",
      "useIsMutating",
      "useQueryClient",
    ],
    queryClientOptions: {
      defaultOptions: { queries: { staleTime: 5000 } },
    },

    vueQueryPluginOptions: {},
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
