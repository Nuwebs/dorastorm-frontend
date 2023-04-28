import {
  getLocatedRouteRules,
  LOCALES,
  DEFAULT_LOCALE,
  STRATEGY,
} from "./services/i18n";
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
    ...getLocatedRouteRules(),
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
    lazy: true,
    langDir: "assets/lang",
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    strategy: STRATEGY,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "ds_i18n",
      redirectOn: "root",
    },
  },
});
