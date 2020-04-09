<template>
  <div
    :class="
      `posts-feed-item posts-feed-item--size-${sizeIndex} posts-feed-item--background-${post.attributes.styleIndex}`
    "
  >
    <div class="posts-feed-item__author">
      <img
        :src="post.attributes.author.image"
        :alt="post.attributes.author.name"
      />
      <div class="posts-feed-item__author-name">
        By
        {{ post.attributes.author.name }}
      </div>
      <div class="posts-feed-item__author-social">twitter</div>
    </div>
    <div class="posts-feed-item__content">
      <div class="posts-feed-item__info">
        <div
          v-for="(category, index) in post.attributes.categories"
          :key="index"
          class="posts-feed-item__categories"
        >
          <p class="posts-feed-item__categories-item">{{ category }}</p>
        </div>
        <p class="posts-feed-item__date">{{ post.attributes.date }}</p>
      </div>
      <h1 class="posts-feed-item__title">
        <nuxt-link :to="post._path">
          {{ post.attributes.title }}
        </nuxt-link>
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostFeedItem',
  props: {
    post: {
      type: Object,
      default() {}
    },
    sizeIndex: {
      type: Number,
      default() {}
    }
  }
}
</script>

<style scoped lang="scss">
.posts-feed-item {
  border-radius: rem(20px);
  box-shadow: 0 0 rem(75px) 0 #d2d2d2;
  background-color: #ffffff;
  &--size {
    display: grid;
    &-0,
    &-7 {
      grid-row: span 2;
      grid-column: span 2;
    }
    &-1,
    &-2,
    &-4,
    &-6,
    &-8,
    &-9 {
      grid-row: span 2;
    }
    &-3,
    &-5,
    &-10,
    &-11 {
      grid-column: span 3;
    }
  }
}
</style>
