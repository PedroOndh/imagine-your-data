<template>
  <div class="page">
    <PageHeader />
    <nuxt class="page__content" />
    <PageFooter />
    <CMSButtons v-if="dev" />
  </div>
</template>

<script>
import CMSButtons from '~/components/common/CMSButtons'
import PageHeader from '~/components/common/PageHeader'
import PageFooter from '~/components/common/footer/PageFooter'

export default {
  components: { PageHeader, PageFooter, CMSButtons },
  data() {
    return {
      dev: this.$nuxt.context.env.dev
    }
  }
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
