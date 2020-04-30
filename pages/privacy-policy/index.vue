<template>
  <div class="small-container policy">
    <h1 class="page-title">Privacy Policy</h1>
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
    font-weight: 300;
  }
  tr td {
    background: #eee;
    padding: 0.5rem 1rem;
  }
  tr th {
    background: #ddd;
    padding: 0.5rem 1rem;
  }
}
</style>

<script>
import PostContent from '../../components/post/PostContent'
export default {
  layout: 'page',
  components: { PostContent },
  async asyncData() {
    const content = await import(`~/content/pages/privacy.md`)
    return {
      content: { ...content }
    }
  }
}
</script>
