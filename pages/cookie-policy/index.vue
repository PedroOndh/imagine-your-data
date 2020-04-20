<template>
  <div class="container policy">
    <h1>Cookie Policy</h1>
    <PostContent :content="content.html" />
  </div>
</template>

<style lang="scss">
.policy {
  h1 {
    line-height: 1.22;
    text-align: center;
    color: $grey-medium;
    margin-bottom: rem(75px);
  }
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
    const content = await import(`~/content/pages/cookie.md`)
    return {
      content: { ...content }
    }
  }
}
</script>
