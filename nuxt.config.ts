// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  css: [
    'primevue/resources/themes/saga-blue/theme.css',
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
    'primeflex/primeflex.css',
    //'@/assets/detectee-styles.css',
  ],
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap&display=swap',
        },
      ],
    },
  },
  build: {
    transpile: ['primevue']
  },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
})
