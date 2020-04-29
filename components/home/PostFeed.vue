<template>
  <section>
    <div class="container posts-feed">
      <PostFeedItem
        v-for="(post, index) in posts"
        :id="index"
        :key="post.attributes.index"
        :post="post"
        :size-index="index % 9"
      />
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
$grid-gap: 2.19vw;
section {
  margin-top: 12vw;
  padding-bottom: rem(140px);
  background-color: $grey-background;
  &.posts--filtering {
    padding-top: 20rem;
    margin-top: -5rem;
  }
  .posts-feed {
    position: relative;
    top: -8.5vw;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-auto-rows: 16.3vw;
    transition: all 1s ease;

    .posts-feed-item {
      border-radius: rem(20px);
      box-shadow: 0 0 rem(75px) 0 #d2d2d2;
      margin-bottom: $grid-gap;
      display: grid;
      grid-row: span 2;

      &--size {
        &-0,
        &-4,
        &-8,
        &-9 {
          grid-column: span 2;
        }

        &-0 {
          margin-right: 2 * $grid-gap;
        }

        &-1 {
          position: relative;
          right: $grid-gap;
        }

        &-4 {
          margin-left: $grid-gap;
          margin-right: $grid-gap;
        }

        &-7 {
          position: relative;
          left: $grid-gap;
        }

        &-8 {
          margin-left: 2 * $grid-gap;
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
      }

      @keyframes appearing {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    }
  }
  @media screen and (min-width: $breakpoint__large-desktop--min) {
    .posts-feed {
      grid-auto-rows: rem(313px);
    }
    &.posts--filtering {
      margin-top: 0;
    }
  }
  @media screen and (max-width: $breakpoint__small-desktop--max) {
    .posts-feed {
      grid-auto-rows: 19vw;
    }
  }
  @media screen and (max-width: $breakpoint__tablet--max) {
    margin-top: 5rem;
    &.posts--filtering {
      padding-top: 6rem;
      margin-top: 0;
    }
    .posts-feed {
      margin-top: 8rem;
      grid-template-columns: 1fr;
      grid-auto-rows: 25vw;
      .posts-feed-item {
        margin-bottom: $grid-gap;
        grid-row: span 1;
        grid-column: span 1;
        margin-left: 0;
        margin-right: 0;
        right: 0;
        left: 0;
        background-size: 100%;
        background-position: 0 -10vw;
      }
    }
  }
  @media screen and (max-width: $breakpoint__small-tablet--max) {
    .posts-feed {
      grid-auto-rows: 50vw;
    }
  }
  @media screen and (max-width: $breakpoint__mobile--max) {
    .posts-feed {
      margin-top: 5rem;
      grid-auto-rows: 120vw;

      .posts-feed-item {
        background-size: 200%;
        background-position: center -20vw;
        margin-bottom: 12vw;
      }
    }
  }
}
</style>
