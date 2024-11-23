import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@primevue/nuxt-module", "@pinia/nuxt", "@nuxtjs/i18n"],
  css: ["~/assets/styles/ds.css", "primeicons/primeicons.css"],

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".ds-dark-mode",
          cssLayer: {
            name: "primevue",
            order: "tailwind-base, primevue, tailwind-utilities",
          },
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      backendURL: process.env.backendURL || "http://localhost:8000",
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
