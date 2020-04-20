<template>
  <div
    :class="
      `posts-feed-item posts-feed-item--size-${sizeIndex} posts-feed-item--background-${post
        .attributes.index % 12}`
    "
  >
    <nuxt-link :to="post._path">
      <div v-if="post.attributes.author" class="posts-feed-item__author">
        <img
          class="posts-feed-item__author-image"
          :src="post.attributes.author.image"
          :alt="post.attributes.author.name"
        />
        <div class="posts-feed-item__author-name">
          <span class="posts-feed-item__author-by">
            By
          </span>
          <span class="posts-feed-item__author-nickname">{{
            post.attributes.author.nickname
          }}</span>
        </div>
        <div
          v-if="post.attributes.author.twitter"
          class="posts-feed-item__author-social"
        >
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
        <h1 class="posts-feed-item__title">
          {{ truncatedTitle }}
        </h1>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import { trunc } from '~/assets/libs/utils'
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
    const truncatedTitle = trunc(this.$props.post.attributes.title, 65, true)
    return {
      dateString,
      truncatedTitle
    }
  }
}
</script>

<style scoped lang="scss">
.posts-feed-item {
  position: relative;
  &__author {
    width: rem(111px);
    position: absolute;
    z-index: 1;
    right: rem(32px);
    top: rem(-34px);
    font-weight: 600;
    .posts-feed-item__author-image {
      border-radius: 50%;
      background: white;
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
    &-nickname {
      text-transform: lowercase;
    }
  }
  &__info {
    padding-bottom: 1rem;
    p {
      font-size: rem(15px);
      font-weight: 600;
      display: inline;
    }
  }
  &__content {
    color: white;
    position: absolute;
    bottom: rem(40px);
    padding: 0 rem(49px);
    a {
      text-decoration: none;
    }
    h1 {
      font-size: rem(36px);
      font-weight: 300;
      line-height: 1.39;
      min-height: 12vw;
    }
  }
  &--size {
    &-3,
    &-5,
    &-10,
    &-11 {
      .posts-feed-item__content {
        margin-right: 20%;
        h1 {
          min-height: 6vw;
        }
      }
    }
  }
  &--background {
    &-1,
    &-2,
    &-5,
    &-6,
    &-10 {
      .posts-feed-item__content,
      .posts-feed-item__author-by {
        color: $grey-dark;
      }
    }
    &-3,
    &-4,
    &-7,
    &-8 {
      .colored {
        color: $corporative-yellow;
      }
      .posts-feed-item__author {
        &-by {
          color: white;
        }
        &-nickname {
          color: $corporative-yellow;
        }
      }
    }
    &-1 {
      .colored,
      .posts-feed-item__author-nickname {
        color: $corporative-pink;
      }
    }
    &-2,
    &-6 {
      .colored,
      .posts-feed-item__author-nickname {
        color: $corporative-blue;
      }
    }
    &-5 {
      .colored,
      .posts-feed-item__author-nickname {
        color: $corporative-purple;
      }
    }
    &-10 {
      .colored,
      .posts-feed-item__author-nickname {
        color: $corporative-green;
      }
    }
  }
  @media screen and (max-width: $breakpoint__desktop--max) {
    &__content {
      h1 {
        font-size: rem(24px);
      }
    }
    &--size {
      &-3,
      &-5,
      &-10,
      &-11 {
        .posts-feed-item__content h1 {
          min-height: 4vw;
        }
      }
    }
  }
  @media screen and (max-width: $breakpoint__small-desktop--max) {
    &__author {
      width: 5rem;
    }
    &__content {
      padding: 0 2rem;
      h1 {
        font-size: rem(20px);
      }
    }
    &--size {
      &-3,
      &-5,
      &-10,
      &-11 {
        .posts-feed-item__content h1 {
          min-height: 0;
        }
      }
    }
  }
}
</style>
