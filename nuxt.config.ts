// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-mongoose','@vercel/analytics'],
  runtimeConfig: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    public: {
      mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN || '',
      googleClientId: process.env.GOOGLE_CLIENT_ID || ''
    }
  },
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  mongoose: {
    uri: process.env.MONGODB_URI,
    options: {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2
    },
    modelsDir: 'models',
  },
  app: {
    head: {
      title: '广州市第二中学加拿大校友网',
      htmlAttrs: {
        lang: 'zh-CN'
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'charset', content: 'UTF-8' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#11817b' },
        { name: 'description', content: '广州市第二中学加拿大校友之家，联络旅加校友，传承二中精神，分享校友活动与动态。' },
        { name: 'keywords', content: '广州二中, 广州市第二中学, 加拿大校友, 校友会, 校友活动' },
        { property: 'og:site_name', content: '广州市第二中学加拿大校友网' },
        { property: 'og:locale', content: 'zh_CN' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: '广州市第二中学加拿大校友网' },
        { property: 'og:description', content: '广州市第二中学加拿大校友之家，联络旅加校友，传承二中精神，分享校友活动与动态。' },
        { name: 'twitter:card', content: 'summary' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  }
})