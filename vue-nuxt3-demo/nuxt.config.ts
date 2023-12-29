// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Hello Nuxt 3',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: '这是本项目的描述' }
      ]
    }
  },
  modules: [
    '@unocss/nuxt',
  ],
  devtools: {
    enabled: true
  },
  $production: {
    routeRules: {
      '/**': {
        isr: true
      }
    }
  },
  css: [
    '@/assets/styles/common.less',
  ]
})
