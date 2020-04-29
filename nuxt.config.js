import path from 'path'
import glob from 'glob'
import { sortRoutes } from '@nuxt/utils'
import { turnFileNameToPath } from './assets/js/utils'

const markdownPaths = ['blog']

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      {
        name: 'robots',
        content: 'noindex'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://assets.empathybroker.com/resources/fonts/empathy-typography/style.css'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['@/assets/scss/reset.scss', '@/assets/scss/default.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/lightbox.js', '~/plugins/header-scroll.js'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/style-resources', '@nuxtjs/svg'],
  styleResources: {
    scss: [
      './assets/scss/abstracts/_functions.scss',
      './assets/scss/vars/*.scss',
      './assets/scss/abstracts/_mixins.scss'
    ]
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // add frontmatter-markdown-loader
      config.module.rules.push({
        test: /\.md$/,
        include: path.resolve(__dirname, 'content'),
        loader: 'frontmatter-markdown-loader'
      })
    }
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push(...generateRoutes(resolve))
      routes.push(...extraRoutes(resolve))
      sortRoutes(routes)
    }
  }
}

function generateRoutes(resolve) {
  return [].concat(
    ...markdownPaths.map((mdPath) => {
      return glob
        .sync(`${mdPath}/*.md`, { cwd: 'content' })
        .map(filepath => {
        return {
          name: `${path.basename(filepath, '.md')}`,
          path: `/${mdPath}/${turnFileNameToPath(path.basename(filepath, '.md'))}`,
          component: resolve(__dirname, `pages/${mdPath}/_slug.vue`)
        }
      })
    })
  )
}

function extraRoutes(resolve) {
  return [
    {
      name: 'blog',
      path: '/blog',
      component: resolve(__dirname, `pages/index.vue`)
    }
  ]
}
