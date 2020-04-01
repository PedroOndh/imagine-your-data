<template>
  <div class="container">
    <h1 class="title">
      {{ blogPost.attributes.title }}
    </h1>
    <h2 class="subtitle">
      {{ blogPost.attributes.date }}
    </h2>
    <!-- eslint-disable-next-line -->
    <div class="content" v-html="blogPost.html" />
  </div>
</template>
<script>
export default {
  layout: 'page',
  async asyncData({ route, error }) {
    try {
      const blogPost = await import(`~/content/blog/${route.name}.md`)
      return {
        blogPost
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Not found' })
    }
  }
}
</script>
