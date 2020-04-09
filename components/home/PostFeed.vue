<template>
  <section>
    <div class="container posts-feed">
      <!-- eslint-disable-next-line -->
      <PostFeedItem v-for="(post, index) in posts" :key="index" :id="index" :post="post" :size-index="index % 12"/>
    </div>
  </section>
</template>

<script>
import PostFeedItem from './PostFeedItem'
export default {
  name: 'PostFeed',
  components: { PostFeedItem },
  props: {
    posts: {
      type: Array,
      default() {}
    }
  }
}
</script>

<style scoped lang="scss">
section {
  margin-top: rem(280px);
  padding-bottom: rem(140px);
  background-color: #f5f6f7;
  .posts-feed {
    position: relative;
    top: rem(-140px);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-auto-rows: rem(272px);
    grid-gap: rem(42px);
  }
}
</style>
