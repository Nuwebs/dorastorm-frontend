import {
  getLocatedRouteRules,
  LOCALES,
  DEFAULT_LOCALE,
  STRATEGY
} from './services/i18n';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    '/assets/styles/ds.css',
    '/assets/styles/fonts.css',
    'primevue/resources/primevue.css',
    'primeflex/primeflex.css',
    'primeicons/primeicons.css',
    '/assets/styles/containers.css'
  ],
  build: {
    transpile: ['primevue']
  },
  routeRules: {
    ...getLocatedRouteRules()
  },
  imports: {
    autoImport: false
  },
  modules: ['@pinia/nuxt', '@vee-validate/nuxt', '@nuxtjs/i18n', '@nuxtjs/eslint-module'],
  runtimeConfig: {
    public: {
      backendURL: process.env.backendURL || 'http://localhost:8000',
      authEndpoints: {
        login: '/login',
        refresh: '/token',
        logout: '/logout',
        me: '/me'
      }
    }
  },
  i18n: {
    lazy: true,
    langDir: 'assets/lang',
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    strategy: STRATEGY,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'ds_i18n',
      redirectOn: 'root',
      alwaysRedirect: true
    }
  }
});
