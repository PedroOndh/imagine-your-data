<template>
  <div class="page">
    <PageHeader />
    <nuxt class="page__content" />
    <PageFooter />
    <DeployButton v-if="$nuxt.context.env.dev" />
  </div>
</template>

<script>
import DeployButton from '~/components/common/DeployButton'
import PageHeader from '~/components/common/PageHeader'
import PageFooter from '~/components/common/footer/PageFooter'

export default {
  components: { PageHeader, PageFooter, DeployButton }
}
</script>

<style scoped lang="scss">
.page {
  background-image: url('/_media/page-background.svg');
  background-position: 0 -20px;
  background-repeat: no-repeat;
  background-size: 120%;
  &__content {
    padding-top: rem(195px);
  }
  @media screen and (min-width: $breakpoint__small-desktop--min) {
    &__content {
      padding-top: 20vw;
    }
  }
  @media screen and (min-width: $breakpoint__desktop--min) {
    background-size: 114%;
  }
  @media screen and (min-width: $breakpoint__large-desktop--min) {
    background-size: 100%;
    background-position: 0 -40px;
    &__content {
      padding-top: 16vw;
    }
  }
}
</style>
