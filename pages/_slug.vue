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
  async asyncData({ params, payload }) {
    if (payload) return { blogPost: payload }
    else
      return {
        blogPost: await require(`~/content/blog/${params.slug}.md`)
      }
  },
  head() {
    return {
      title: this.post.attributes.title
    }
  }
}
</script>
