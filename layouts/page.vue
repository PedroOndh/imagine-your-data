<template>
  <div class="page">
    <PageHeader />
    <nuxt class="page__content" />
    <PageFooter />
  </div>
</template>

<script>
import PageHeader from '~/components/common/PageHeader'
import PageFooter from '~/components/common/footer/PageFooter'

export default {
  components: { PageHeader, PageFooter }
}
</script>

<style scoped lang="scss">
.page {
  background-image: url('/_media/page-background.svg');
  background-position: 0 -20px;
  background-repeat: no-repeat;
  background-size: 100%;
  &__content {
    padding-top: 16vw;
  }
  @media screen and (min-width: $breakpoint__large-desktop--min) {
    background-position: 0 -40px;
  }
  @media screen and (max-width: $breakpoint__desktop--max) {
    &__content {
      padding-top: 20vw;
    }
    background-size: 114%;
  }
  @media screen and (max-width: $breakpoint__small-desktop--max) {
    background-size: 120%;
  }
  @media screen and (max-width: $breakpoint__tablet--max) {
    &__content {
      padding-top: rem(195px);
    }
  }
}
</style>
