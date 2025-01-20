import Aura from '@primevue/themes/aura';
import {
  availableLocales,
  DEFAULT_LOCALE,
  STRATEGY,
  ZOD_LOCALES_MAP
} from './services/i18n-service';

export default defineNuxtConfig({
  ssr: false,
  spaLoadingTemplate: true,
  imports: {
    autoImport: false,
    scan: false
  },
  components: {
    dirs: []
  },

  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    'nuxt-zod-i18n',
    '@nuxtjs/i18n',
    '@nuxt/eslint'
  ],
  css: ['~/assets/styles/ds.css', 'primeicons/primeicons.css'],

  i18n: {
    lazy: true,
    restructureDir: false,
    langDir: 'assets/lang',
    locales: availableLocales(),
    defaultLocale: DEFAULT_LOCALE,
    strategy: STRATEGY,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'ds_i18n',
      redirectOn: 'root',
      alwaysRedirect: true
    }
  },
  zodI18n: {
    localeCodesMapping: ZOD_LOCALES_MAP
  },

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.ds-dark-mode',
          cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities'
          }
        }
      }
    }
  },

  runtimeConfig: {
    public: {
      backendURL: process.env.backendURL || 'http://localhost:8000'
    }
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  }
});
