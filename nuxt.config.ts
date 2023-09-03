// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@hypernym/nuxt-gsap', '@vueuse/nuxt'],
  ssr: false,
  spaLoadingTemplate: './app/spa-loading-template.html',
  tailwindcss: {
    cssPath: '@/assets/css/tailwind.css',
    injectPosition: 'first',
    viewer: false,
  },
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'Monopoly',
      link: [
        { rel: 'stylesheet', href: 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
        { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#0f1215' },
        { rel: 'shortcut icon', href: '/favicon/favicon.ico' },
      ],
      meta: [
        { name: 'description', content: 'Web application for convenient game of Monopoly.' },
        { name: 'msapplication-TileColor', content: '#0f1215' },
        { name: 'msapplication-config', content: '/favicon/browserconfig.xml' },
        { name: 'theme-color', content: '#0f1215' },
      ],
    },
  },
  imports: {
    dirs: ['stores', 'composables'],
  },
  vite: {
    build: {
      rollupOptions: {
        external: 'NonExistingPath',
      },
    },
  },
})
