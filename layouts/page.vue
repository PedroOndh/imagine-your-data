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
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 100%;
  &__content {
    padding-top: rem(360px);
    margin-bottom: rem(-140px);
  }
  @media screen and (max-width: $breakpoint__small-desktop--max) {
    background-size: 110%;
  }
  @media screen and (max-width: $breakpoint__tablet--max) {
    &__content {
      padding-top: rem(330px);
    }
  }
}
</style>
