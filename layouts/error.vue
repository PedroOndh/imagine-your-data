<template>
  <div class="error-page">
    <div class="error-page__background">
      <img src="/_media/404.svg" alt="404" />
    </div>
    <h1>sorry it looks like we've entered a black hole</h1>
    <nuxt-link to="/">I would like to go home <LinkArrow /></nuxt-link>
  </div>
</template>

<script>
import LinkArrow from '~/static/_media/link-arrow.svg?inline'
export default {
  components: { LinkArrow },
  props: {
    error: {
      type: Object,
      default() {}
    }
  },
  layout: 'page'
}
</script>

<style lang="scss">
.error-page {
  background: white;
  padding-bottom: 10rem;
  &__background {
    width: 90%;
    height: 50vh;
    display: flex;
    justify-content: center;
    margin: rem(-80px) auto 1rem;
    img {
      object-fit: contain;
    }
  }
  h1 {
    font-weight: 300;
    line-height: 1.22;
    text-align: center;
    color: $grey-medium;
    width: 70%;
    max-width: rem(1000px);
    margin: 0 auto rem(75px);
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
  @media screen and (max-width: $breakpoint__tablet--max) {
    &__background {
      margin: rem(-60px) auto 0;
    }
    h1 {
      width: 80%;
    }
  }
}
</style>
