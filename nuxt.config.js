import path from 'path'
import fs from 'fs'
import glob from 'glob'
import fm from 'front-matter'
import { turnFileNameToPath } from './assets/js/utils'
const fsPromise = fs.promises

const env = require('dotenv').config()

const markdownPaths = ['blog']

export default async () => {
  const routesData = await getRoutesData()
  return {
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
        noIndex()
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
    modules: ['@nuxtjs/style-resources', '@nuxtjs/svg', '@nuxtjs/sitemap'],
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
        generateRoutes(routes, resolve, routesData)
      }
    },
    sitemap: {
      path: '/sitemap.xml',
      hostname: 'https://imagineyourdata.com/',
      cacheTime: 1000 * 60 * 15,
      gzip: true,
      exclude: ['/admin'],
      defaults: {
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date()
      },
      routes: generateSiteMapRoutes(routesData)
    }
  }
}
async function getRoutesData() {
  const routesData = []
  for (let i = 0; i < markdownPaths.length; i++) {
    const mdPath = markdownPaths[i]
    const files = glob.sync(`${mdPath}/*.md`, { cwd: 'content' })
    for (let j = 0; j < files.length; j++) {
      const filePath = files[j]
      const data = await fsPromise.readFile(`content/${filePath}`)
      const objectData = fm(data.toString('utf8'))
      const slug = objectData.attributes.slug
      const path = `/${mdPath}/${
        !slug ? turnFileNameToPath(filePath.replace(`${mdPath}/`, '')) : slug
      }`
      const finalData = {
        ...objectData,
        filePath,
        mdPath,
        path
      }
      routesData.push(finalData)
    }
  }
  return routesData
}
function generateRoutes(routes, resolve, routesData) {
  routesData.map((data) => {
    routes.push({
      name: data.filePath,
      path: data.path,
      component: resolve(__dirname, `layouts/${data.mdPath}.vue`)
    })
  })
}
function generateSiteMapRoutes(routesData) {
  const sitemapRoutes = routesData.map((route) => {
    return {
      url: route.path,
      lastmod: route.attributes.date
    }
  })
  sitemapRoutes.push({
    url: '/',
    priority: 1,
    changefreq: 'daily'
  })
  return sitemapRoutes
}

function noIndex() {
  if (env.parsed && env.parsed.PROD_URL === 'false') {
    return {
      name: 'robots',
      content: 'noindex'
    }
  }
  return {
    name: 'google-site-verification',
    content: 'M15PvV_pw0n1sIiCEhAyQnlk2TpMlm0wZAkQfUIEocU'
  }
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
