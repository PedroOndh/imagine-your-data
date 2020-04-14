<template>
  <div
    :class="
      `posts-feed-item posts-feed-item--size-${sizeIndex} posts-feed-item--background-${post
        .attributes.index % 12}`
    "
  >
    <div class="posts-feed-item__author">
      <img
        class="posts-feed-item__author-image"
        :src="post.attributes.author.image"
        :alt="post.attributes.author.name"
      />
      <div class="posts-feed-item__author-name">
        By
        <span class="colored">{{ post.attributes.author.name }}</span>
      </div>
      <div class="posts-feed-item__author-social">
        <img
          class="posts-feed-item__author-twitter"
          src="/_media/twitter-white.png"
          alt="twitter"
        />
      </div>
    </div>
    <div class="posts-feed-item__content">
      <div class="posts-feed-item__info">
        <p
          v-for="(category, index) in post.attributes.categories"
          :key="index"
          class="posts-feed-item__categories-item"
        >
          {{ `${index > 0 ? '- ' : ''}${category}` }}
        </p>
        •
        <p class="posts-feed-item__date colored">{{ dateString }}</p>
      </div>

      <nuxt-link :to="post._path">
        <h1 class="posts-feed-item__title">
          {{ post.attributes.title }}
        </h1>
      </nuxt-link>
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
  },
  data() {
    const date = new Date(this.$props.post.attributes.date)
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
    const dateString = `${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()}`
    return {
      dateString
    }
  }
}
</script>

<style scoped lang="scss">
.posts-feed-item {
  position: relative;
  padding: 0 rem(49px);
  &__author {
    width: rem(111px);
    position: absolute;
    z-index: 1;
    right: rem(32px);
    top: rem(-34px);
    font-weight: 600;
    .posts-feed-item__author-image {
      border-radius: 50%;
    }
    .posts-feed-item__author-twitter {
      display: flex;
      margin: auto;
      width: rem(14px);
    }
    &-name {
      font-size: rem(15px);
      padding: 1rem 0;
      text-align: center;
      color: $grey-dark;
      span {
        color: white;
      }
    }
  }
  &__info {
    font-size: rem(15px);
    padding-bottom: 1rem;
    p {
      font-weight: 600;
      display: inline;
    }
  }
  &__content {
    color: white;
    margin-top: 16.3vw;
    a {
      text-decoration: none;
    }
    h1 {
      font-size: 36px;
      font-weight: 300;
      line-height: 1.39;
      height: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  &--size {
    &-3,
    &-5,
    &-10,
    &-11 {
      .posts-feed-item__content {
        margin-top: 4vw;
        margin-right: 20%;
      }
    }
  }
  &--background {
    &-1,
    &-2,
    &-5,
    &-6,
    &-10 {
      .posts-feed-item__content {
        color: $grey-dark;
      }
    }
    &-1 .colored {
      color: $corporative-pink;
    }
    &-2 .colored {
      color: $corporative-blue;
    }
    &-5 .colored {
      color: $corporative-purple;
    }
    &-6 .colored {
      color: $corporative-blue;
    }
    &-10 .colored {
      color: $corporative-green;
    }
  }
}
</style>
