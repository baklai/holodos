import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '.env.prod')
      : path.join(__dirname, '.env.dev')
});

export default {
  telemetry: false,
  ssr: false,

  cli: {
    badgeMessages: [
      `Application: ${process.env.npm_package_name.toUpperCase()}`,
      `Version:     ${process.env.npm_package_version}`
    ],
    bannerColor: 'green'
  },

  publicRuntimeConfig: {},

  server: {
    port: process.env.NODE_ENV.PORT,
    host: process.env.NODE_ENV.HOST,
    https:
      process.env.NODE_ENV === 'production'
        ? false
        : {
            key: fs.readFileSync(
              path.resolve(__dirname, 'certs', 'server.key')
            ),
            cert: fs.readFileSync(
              path.resolve(__dirname, 'certs', 'server.crt')
            )
          }
  },

  router: {
    prefetchLinks: false
  },

  head: {
    titleTemplate: `Холодос • %s`,
    title: 'мій список продуктів',
    htmlAttrs: {
      lang: 'ua'
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
          'Холодос – це бот-додаток, що робить процес походу в магазин простіше, швидше, і що найголовніше, ефективніше.'
      },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'google', content: 'notranslate' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [{ src: 'https://tg.dev/js/telegram-web-app.js' }]
  },

  components: true,

  loadingIndicator: {
    name: 'cube-grid',
    color: '#f8a917',
    background: '#FFFFFF'
  },

  loading: false,

  css: ['~/assets/transition.css', '~/assets/holodos.css'],

  modules: ['@nuxt/image', '~/modules/index.js'],

  build: {
    publicPath: 'cdn/',
    babel: {
      plugins: [
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-proposal-private-methods', { loose: true }],
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }]
      ]
    }
  }
};
