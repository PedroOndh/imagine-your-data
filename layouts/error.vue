<template>
  <div class="error-page">
    <PageHeader />
    <div class="error-page__content">
      <div class="error-page__background">
        <img src="/_media/404.svg" alt="404" />
      </div>
      <h1 class="page-title">sorry it looks like we've entered a black hole</h1>
      <nuxt-link to="/">I would like to go home <LinkArrow /></nuxt-link>
    </div>
    <PageFooter />
  </div>
</template>

<script>
import PageFooter from '~/components/common/footer/PageFooter'
import PageHeader from '~/components/common/PageHeader'
import LinkArrow from '~/static/_media/link-arrow.svg?inline'
export default {
  components: { LinkArrow, PageHeader, PageFooter },
  props: {
    error: {
      type: Object,
      default() {}
    }
  }
}
</script>

<style scoped lang="scss">
.error-page {
  &__content {
    padding-top: rem(195px);
    h1 {
      font-weight: $font-weight--light;
      line-height: 1.22;
      text-align: center;
      color: $grey-dark;
      width: 80%;
      max-width: rem(1000px);
      margin: 0 auto rem(75px);
    }
    a {
      margin-top: rem(50px);
      margin-bottom: rem(150px);
      font-size: rem(16px);
      font-weight: $font-weight--semibold;
      letter-spacing: 0.37px;
      color: #2e2e2e;
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        height: 2.8rem;
        transition: padding $transitions-duration ease;
      }

      &:hover svg {
        padding-left: 0.5rem;
      }
    }
  }
  &__background {
    width: 90%;
    height: 40vh;
    display: flex;
    justify-content: center;
    margin: rem(-60px) auto 0;
    img {
      object-fit: contain;
    }
  }
  @media screen and (min-width: $breakpoint__tablet--min) {
    &__background {
      height: 50vh;
      margin: rem(-80px) auto 1rem;
    }
  }
  @media screen and (min-width: $breakpoint__small-desktop--min) {
    &__content {
      padding-top: 20vw;
    }
  }
  @media screen and (min-width: $breakpoint__large-desktop--min) {
    .header {
      margin-top: rem(70px);
      &--fixed {
        margin-top: 0;
      }
    }
    &__content {
      padding-top: 16vw;
      h1 {
        width: 70%;
      }
      a {
        margin-bottom: rem(250px);
      }
    }
  }
}
</style>
