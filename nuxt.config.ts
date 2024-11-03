// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxtjs/i18n"],

  runtimeConfig: {
    public: {
      backendURL: process.env.backendURL || "http://localhost:8000",
      authEndpoints: {
        login: "/login",
        refresh: "/token",
        logout: "/logout",
        me: "/me",
      },
    },
  },
});