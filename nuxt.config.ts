// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    "primevue/resources/themes/lara-light-blue/theme.css",
    "primevue/resources/primevue.css",
    "primeflex/primeflex.css",
    "primeicons/primeicons.css",
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
  modules: ["@pinia/nuxt", "@vee-validate/nuxt", "@nuxtjs/i18n"],
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
  i18n: {
    locales: [
      {
        code: "en",
        file: "en.json",
      },
      {
        code: "es",
        file: "es.json",
      },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "ds_i18n",
      redirectOn: "root",
    },
    lazy: true,
    langDir: "assets/lang",
    defaultLocale: "en",
  },
});
