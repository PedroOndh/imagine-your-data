<template>
  <div class="page">
    <PageHeader />
    <nuxt class="page__content" />
    <PageFooter />
  </div>
</template>

<script>
import PageHeader from '~/components/common/PageHeader'
import PageFooter from '~/components/common/PageFooter'

export default {
  components: { PageHeader, PageFooter }
}
</script>

<style scoped></style>
