<template>
  <div
    :class="
      `posts-feed-item posts-feed-item--size-${sizeIndex} posts-feed-item--background-${style}`
    "
  >
    <div class="posts-feed-item__background">
      <div
        class="posts-feed-item__background-image"
        :style="`background-image: url('${post.attributes.image}')`"
      />
      <div class="posts-feed-item__background-color" />
      <div class="posts-feed-item__background-gradient" />
    </div>
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
          <p class="posts-feed-item__categories-item colored">
            {{ post.attributes.category }}
          </p>
          <!--
          •
          <p class="posts-feed-item__date colored">{{ dateString }}</p>
          -->
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
import { trunc } from '~/assets/js/utils'
import { months } from '~/assets/js/consts'
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
      const dayNumber = date.getDate().toString()
      const dateString = `${
        dayNumber.length === 1 ? `0${dayNumber}` : dayNumber
      } ${months[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`
      return dateString
    },
    getStyle: (post) => {
      const { category, typology } = post.attributes
      if (category === 'Data Visualizations') {
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
@mixin color-and-gradient($selector, $color) {
  #{$selector} {
    .posts-feed-item__background-color {
      background: $color;
    }
    .posts-feed-item__background-gradient {
      background: linear-gradient(
        175deg,
        rgba(255, 255, 255, 0) 0%,
        $color 80%
      );
    }
  }
}
@mixin custom-item-color($selector, $color) {
  #{$selector} {
    .colored,
    .posts-feed-item__author-nickname {
      color: $color;
      path {
        fill: $color;
      }
    }
  }
}
.posts-feed-item {
  position: relative;
  &__background {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 1.25rem;
    overflow: hidden;
    &-image {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      filter: grayscale(100%);
    }
    &-color {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      opacity: 0.65;
      background: white;
    }
    &-gradient {
      width: 100%;
      height: 100%;
      position: absolute;
      bottom: 0;
      background: linear-gradient(175deg, rgba(255, 255, 255, 0) 0%, white 80%);
    }
  }
  &--background {
    &-0dv,
    &-1dv,
    &-2dv,
    &-3dv,
    &-4dv,
    &-0us,
    &-1us,
    &-2us,
    &-3us {
      animation-name: appearing;
      animation-duration: 0.8s;
    }
    @include color-and-gradient('&-0dv', $corporative-light-blue);

    @include color-and-gradient('&-1dv', $corporative-pink);

    @include color-and-gradient('&-2dv', $corporative-green);

    @include color-and-gradient('&-3dv', $corporative-purple);

    @include color-and-gradient('&-4dv', #0086b2);
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
      font-size: rem(32px);
      font-weight: 300;
      line-height: 1.39;
      min-height: 11vw;
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
    &-0dv,
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
    @include custom-item-color('&-0us', $corporative-pink);

    @include custom-item-color('&-1us', $corporative-blue);

    @include custom-item-color('&-2us', $corporative-purple);

    @include custom-item-color('&-3us', $corporative-green);
  }
  @media screen and (min-width: $breakpoint__large-desktop--min) {
    &__content {
      h1 {
        min-height: rem(211px);
      }
    }
  }
  @media screen and (max-width: $breakpoint__desktop--max) {
    &__content {
      h1 {
        font-size: rem(24px);
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
