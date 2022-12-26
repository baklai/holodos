import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '.env.prod')
      : path.join(__dirname, '.env.dev')
});

export default {
  telemetry: false,
  ssr: false,

  target: 'static',

  generate: {
    dir: 'client'
  },

  cli: {
    badgeMessages: [
      `Application: ${process.env.npm_package_name.toUpperCase()}`,
      `Version:     ${process.env.npm_package_version}`
    ],
    bannerColor: 'green'
  },

  router: {
    prefetchLinks: false
  },

  head: {
    titleTemplate: `Холодос • %s`,
    title: 'мій список продуктів',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'Холодос - це бот-додаток, що робить процес походу до магазину простіше, швидше, і найголовніше, ефективніше.'
      },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'google', content: 'notranslate' }
    ],
    link: [
      { rel: 'stylesheet', href: '/css/loading.css' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [{ src: 'https://tg.dev/js/telegram-web-app.js' }]
  },

  loadingIndicator: {
    name: 'cube-grid',
    color: '#F5F5F5',
    background: '#FFFFFF'
  },

  components: true,

  css: ['~/assets/transition.css', '~/assets/holodos.css'],

  modules: ['@nuxtjs/axios'],

  axios: {
    credentials: false,
    baseURL: '/'
  },

  build: {
    publicPath: 'cdn/'
  }
};
