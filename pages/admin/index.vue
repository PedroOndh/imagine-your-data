<template>
  <div></div>
</template>

<style lang="scss">
aside a {
  & span {
    display: inline-flex !important;
    justify-content: center;
    align-items: center;
    & svg {
      display: none !important;
    }

    &::before {
      font-family: 'empathy-icons';
      font-size: 1rem;
    }
  }
  &[href='#/collections/blog'] span::before {
    content: '\e909';
  }
  &[href='#/collections/categories'] span::before {
    content: '\e904';
  }
  &[href='#/collections/authors'] span::before {
    content: '\e945';
  }
  &[href='#/collections/quotes'] span::before {
    content: '\e93b';
  }
  &[href='#/collections/pages'] span::before {
    content: '\e927';
  }
}
</style>

<script>
import adminConfig from '~/static/admin/adminConfig'
if (process.client) {
  import('netlify-cms').then((cms) => {
    cms.registerPreviewStyle(
      'https://assets.empathybroker.com/resources/fonts/empathy-typography/style.css'
    )
    cms.registerPreviewStyle('/admin/admin.css')
    adminConfig(cms)
  }) // eslint-disable-line
}

export default {
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href:
            'https://assets.empathybroker.com/resources/fonts/empathy-icons/style.css'
        }
      ]
    }
  }
}
</script>
