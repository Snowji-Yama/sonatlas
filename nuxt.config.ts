// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // ponytail: SPA pure — pas de SEO à faire ici, et ça rend l'hébergement
  // interchangeable (Cloudflare Pages / Vercel / n'importe quel statique).
  ssr: false,

  modules: ['@nuxt/fonts'],
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'SONATLAS',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#d9d8d3' },
      ],
    },
    pageTransition: { name: 'slide', mode: 'out-in' },
  },

  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseKey: '',
    },
  },
})
