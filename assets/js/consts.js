export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const catchPhrase = 'Visualizing eCommerce Search & Browse'

export const redirections = [
  {
    path: '/pages/all-posts',
    redirect: '/'
  },
  {
    path: '/blog',
    redirect: '/'
  },
  {
    path: '/statsapi/2018/06/21/Creating-the-new-EmpathyBroker-alert-system',
    redirect: '/blog/creating-the-new-empathy-alert-system'
  },
  {
    path: '/statsapi/2018/07/27/Now-Visualization',
    redirect:
      '/blog/developing-our-now-visualization-search-funnel-and-real-time-trends'
  },
  {
    path:
      '/statsapi/2019/07/24/MVT-Test-Analyse-and-Optimise-Your-Search-Experienice/',
    redirect: '/blog/mvt-test-analyse-and-optimise-your-search-experience'
  },
  {
    path: '/statsapi/:year/:month/:day/:slug/',
    redirect: '/blog/:slug'
  }
]

export const GITHUB_TOKEN = 'github_token'
