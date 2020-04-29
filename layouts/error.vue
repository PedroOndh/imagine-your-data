<template>
  <div class="error-page">
    <h1 v-if="error.statusCode === 404">Page not found</h1>
    <h1 v-else>An error occurred</h1>
    <nuxt-link to="/">home page <LinkArrow /></nuxt-link>
  </div>
</template>

<script>
import LinkArrow from '~/static/_media/link-arrow.svg?inline'
export default {
  props: {
    error: {
      type: String,
      default() {}
    }
  },
  components: { LinkArrow },
  layout: 'page'
}
</script>

<style lang="scss">
.error-page {
  padding-bottom: 15rem;
  h1 {
    font-weight: 300;
    line-height: 1.22;
    text-align: center;
    color: $grey-medium;
    margin-bottom: rem(75px);
  }
  a {
    margin-top: rem(50px);
    font-size: rem(16px);
    font-weight: 600;
    letter-spacing: 0.37px;
    color: #2e2e2e;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      height: 2.8rem;
      transition: padding 0.5s ease;
    }
    &:hover svg {
      padding-left: 0.5rem;
    }
  }
}
</style>
