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
  ]
})
