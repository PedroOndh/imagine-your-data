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
  components: { PageHeader, PageFooter, DeployButton },
  layout: 'default'
}
</script>

<style scoped lang="scss">
.page {
  &__content {
    padding-top: rem(195px);
  }
  @media screen and (min-width: $breakpoint__small-desktop--min) {
    &__content {
      padding-top: 20vw;
    }
  }
  @media screen and (min-width: $breakpoint__large-desktop--min) {
    &__content {
      padding-top: 16vw;
    }
  }
}
</style>
