<template>
  <div>
    <h1>{{ content.attributes.title }}</h1>
    <!-- eslint-disable-next-line -->
    <div v-html="content.html" />
  </div>
</template>

<script>
export default {
  layout: 'page',
  async asyncData() {
    const content = await import(`~/content/pages/about.md`)
    return {
      content
    }
  }
}
</script>

<style scoped></style>
