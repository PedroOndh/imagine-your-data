<template>
  <section>
    <div class="container">
      <!-- eslint-disable-next-line -->
      <div v-for="(post, index) in posts" :key="index" :id="index" class="columns">
        <PostFeedItem :post="post" />
      </div>
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
  background-color: #f5f6f7;
  padding-bottom: rem(280px);
}
</style>
