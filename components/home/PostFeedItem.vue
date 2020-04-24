<template>
  <div
    :class="
      `posts-feed-item posts-feed-item--size-${sizeIndex} posts-feed-item--background-${style}`
    "
  >
    <div
      class="posts-feed-item__background"
      :style="`background-image: url('${post.attributes.image}')`"
    />
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
        class="posts-feed-item__author-social colored"
      >
        <a :href="post.attributes.author.twitter">
          <TwitterIcon />
        </a>
      </div>
    </div>
    <nuxt-link :to="post._path" class="posts-feed-item__link">
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
import TwitterIcon from '~/static/_media/twitter.svg?inline'
import { trunc } from '~/assets/libs/utils'
export default {
  name: 'PostFeedItem',
  components: { TwitterIcon },
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
    const truncatedTitle = trunc(this.$props.post.attributes.title, 65, true)
    return {
      dateString: this.getDate(this.$props.post),
      style: this.getStyle(this.$props.post),
      truncatedTitle
    }
  },
  methods: {
    getDate: (post) => {
      const date = new Date(post.attributes.date)
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
      return dateString
    },
    getStyle: (post) => {
      const { categories, typology } = post.attributes
      if (categories[0] === 'Data Visualizations') {
        if (typology === 'Bubbles') {
          return '0dv'
        } else if (typology === 'Bars') {
          return '1dv'
        } else if (typology === 'Lines') {
          return '2dv'
        } else if (typology === 'Relations') {
          return '3dv'
        } else {
          return '4dv'
        }
      } else {
        const noTypologyStyles = ['0us', '1us', '2us', '3us']
        const randomNumber = Math.floor(Math.random() * 4)
        return noTypologyStyles[randomNumber]
      }
    }
  }
}
</script>

<style scoped lang="scss">
.posts-feed-item {
  position: relative;
  &__background {
    width: 100%;
    height: 100%;
    position: absolute;
    background-size: cover;
    background-position: center;
    background-blend-mode: multiply;
    opacity: 0.09;
    border-radius: 1.25rem;
    filter: grayscale(100%) invert(1);
  }
  &--background-0us,
  &--background-1us,
  &--background-2us,
  &--background-3us {
    .posts-feed-item__background {
      opacity: 0.12;
      filter: grayscale(100%);
    }
  }
  &__author {
    width: rem(95px);
    position: absolute;
    z-index: 1;
    right: rem(32px);
    top: rem(-24px);
    font-weight: 600;
    .posts-feed-item__author-image {
      border-radius: 50%;
      background: white;
    }
    &-social {
      text-align: center;
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
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 3.0625rem 2.5rem;
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
        padding-right: 25%;
        h1 {
          min-height: 6vw;
        }
      }
    }
  }
  &--background {
    &-0us,
    &-1us,
    &-2us,
    &-3us {
      .posts-feed-item__content,
      .posts-feed-item__author-by {
        color: $grey-dark;
      }
    }
    &-1dv,
    &-2dv,
    &-3dv,
    &-4dv {
      .colored {
        color: $corporative-yellow;
        path {
          fill: $corporative-yellow;
        }
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
    &-0us {
      .colored,
      .posts-feed-item__author-nickname {
        color: $corporative-pink;
        path {
          fill: $corporative-pink;
        }
      }
    }
    &-1us {
      .colored,
      .posts-feed-item__author-nickname {
        color: $corporative-blue;
        path {
          fill: $corporative-blue;
        }
      }
    }
    &-2us {
      .colored,
      .posts-feed-item__author-nickname {
        color: $corporative-purple;
        path {
          fill: $corporative-purple;
        }
      }
    }
    &-3us {
      .colored,
      .posts-feed-item__author-nickname {
        color: $corporative-green;
        path {
          fill: $corporative-green;
        }
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
      padding: 0 2rem 2.5rem;
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
  @media screen and (max-width: $breakpoint__tablet--max) {
    &__link .posts-feed-item__content {
      padding-right: 25%;
      h1 {
        min-height: auto;
      }
    }
  }
  @media screen and (max-width: $breakpoint__mobile--max) {
    &__link .posts-feed-item__content {
      padding-right: 2rem;
    }
  }
}
</style>
