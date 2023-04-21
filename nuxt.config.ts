// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    "primevue/resources/themes/lara-light-blue/theme.css",
    "primevue/resources/primevue.css",
    "primeflex/primeflex.css",
    "primeicons/primeicons.css"
  ],
  build: {
    transpile: ["primevue"],
  },
  routeRules: {
    "/ds/**": { ssr: false },
  },
  imports: {
    autoImport: false,
  },
  modules: ["@pinia/nuxt"],
  runtimeConfig: {
    public: {
      backendURL: "http://localhost:8000",
      authEndpoints: {
        login: "/login",
        refresh: "/token",
        logout: "/logout",
        me: "/me",
      },
    },
  },
});
