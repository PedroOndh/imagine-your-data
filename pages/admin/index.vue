<template>
  <div />
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
  &[href='#/collections/categories'] {
    display: none;
    span::before {
      content: '\e904';
    }
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
if (process.client) {
  if (
    process.env.NODE_ENV === 'development' ||
    window.location.href.indexOf('dev.') > 0
  ) {
    console.log('hola, estoy en admin-dev')
    // eslint-disable-next-line
    import('~/static/admin/adminConfig')
  }
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
