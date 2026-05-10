// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vite-pwa/nuxt',
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseApiKey: process.env.SUPABASE_API_KEY,
      superadminEmail: process.env.SUPERADMIN_EMAIL,
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Cashbook',
      short_name: 'Cashbook',
      theme_color: '#000000',
      background_color: '#ffffff',
      display: 'standalone',

      icons: [
        {
          src: '/mazer/assets/compiled/png/logo.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    devOptions: {
      enabled: true
    }
  },
})
