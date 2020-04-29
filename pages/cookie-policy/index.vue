<template>
  <div class="container policy">
    <h1>Cookie Policy</h1>
    <client-only>
      <PostContent :content="content.html" />
    </client-only>
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
