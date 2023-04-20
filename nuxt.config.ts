// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  routeRules: {
    '/ds/**': {ssr: false}
  },
  imports: {
    autoImport: false
  },
  modules: [
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    public: {
      backendURL: 'http://localhost:8000',
      authEndpoints: {
        login: '/login',
        refresh: '/token',
        logout: '/logout',
        me: '/me'
      }
    }
  }
})
