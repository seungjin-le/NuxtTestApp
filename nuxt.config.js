// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/tailwindcss.css"],
  modules: ["@pinia/nuxt", "@nuxtjs/mdc", "@hebilicious/vue-query-nuxt"],
  app: {
    head: {
      title: "Asana Task",
      meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
    },
  },
  runtimeConfig: {
    public: {
      NUXT_ENV_API_KEY: process.env.NUXT_ENV_API_KEY,
    },
  },
  vite: {
    server: {
      proxy: {
        "/api/v1": {
          target: process.env.NUXT_ENV_API_KEY,
          changeOrigin: true,
        },
      },
    },
  },
  nitro: {
    routeRules: {
      "/api/v1/**": {
        proxy: process.env.NUXT_ENV_API_KEY,
        changeOrigin: true,
      },
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
  plugins: ["~/plugins/vue-excel-editor.js"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: "2024-08-31",
});
