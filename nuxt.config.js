import path from 'path'
import fs from 'fs'
import glob from 'glob'
import fm from 'front-matter'
import { turnFileNameToPath } from './assets/js/utils'
const fsPromise = fs.promises

const env = require('dotenv').config()

const markdownPaths = ['blog']

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    htmlAttrs: {
      lang: 'en'
    },
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
    ],
    script: generateScripts()
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
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv'
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
  generate: {
    fallback: '404.html'
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
      generateRoutes(routes, resolve)
    }
  }
}

function generateRoutes(routes, resolve) {
  markdownPaths.map((mdPath) => {
    glob.sync(`${mdPath}/*.md`, { cwd: 'content' }).map((filePath) => {
      fsPromise.readFile(`content/${filePath}`).then((data) => {
        const slug = fm(data.toString('utf8')).attributes.slug
        routes.push({
          name: filePath,
          path: `/${mdPath}/${
            !slug
              ? turnFileNameToPath(filePath.replace(`${mdPath}/`, ''))
              : slug
          }`,
          component: resolve(__dirname, `layouts/${mdPath}.vue`)
        })
      })
    })
  })
}

function generateScripts() {
  if (env.parsed && env.parsed.ANALYTICS === 'true') {
    return [
      {
        src: 'https://cdn.usefathom.com/script.js',
        site: 'QZMVLHGF',
        defer: true,
        body: true
      }
    ]
  }
  return []
}
