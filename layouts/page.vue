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
  background-image: url('/_media/page-background.png');
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 80%;
  &__content {
    margin-bottom: rem(-140px);
  }
}
</style>
