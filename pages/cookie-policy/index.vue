<template>
  <div class="small-container policy">
    <h1 class="page-title">Cookie Policy</h1>
    <client-only>
      <PostContent :content="content.html" />
    </client-only>
  </div>
</template>

<style lang="scss">
.policy {
  h1,
  h2,
  h3 {
    font-weight: $font-weight--light;
  }
}
</style>

<script>
import PostContent from '../../components/post/PostContent'
export default {
  layout: 'page',
  components: { PostContent },
  async asyncData() {
    const content = await import(`~/content/pages/cookie.md`)
    return {
      content: { ...content }
    }
  }
}
</script>
