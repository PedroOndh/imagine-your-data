<template>
  <section class="posts">
    <div class="container posts-feed">
      <transition-group
        name="reordering"
        tag="div"
        class="posts-feed__transition"
      >
        <PostFeedItem
          v-for="(post, index) in posts"
          :id="index"
          :key="post.attributes.index"
          :post="post"
          :size-index="index % 9"
        />
      </transition-group>
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
section.posts {
  margin-top: calc(12vw + 5rem);
  padding-bottom: rem(140px);
  background-color: $grey-background;
  &.posts--filtering {
    padding-top: calc(15rem + 8.5vw);
    margin-top: 0;
  }
  .posts-feed .posts-feed__transition {
    position: relative;
    top: calc(-8.5vw - 5rem);
    display: flex;
    flex-wrap: wrap;
    transition: all 1s ease;
    width: calc(105% + 10rem);
    overflow: hidden;
    padding: 5rem;
    margin-top: -5rem;
    margin-left: -5rem;

    .posts-feed-item {
      border-radius: rem(20px);
      box-shadow: 0 0 rem(75px) 0 #d2d2d2;
      margin-bottom: $grid-gap;
      width: 23.8%;
      height: rem(584px);
      transition-property: opacity, width, margin;
      transition-duration: 0.8s;
      &.reordering {
        &-enter {
          opacity: 0;
          width: 0;
          margin-left: 0;
          margin-right: 0;
          &-active {
            width: 23.8%;
            &.posts-feed-item--size {
              &-0,
              &-4,
              &-8,
              &-9 {
                width: calc(47.6% - 2 * 2.19vw);
              }
            }
          }
        }
        &-leave-active {
          opacity: 0;
          width: 0;
          margin-left: 0;
          margin-right: 0;

          & .posts-feed-item__author,
          & .posts-feed-item__link {
            display: none;
          }
        }
      }
      &--size {
        &-0,
        &-4,
        &-8,
        &-9 {
          width: calc(47.6% - 2 * 2.19vw);
        }
        &-1,
        &-2,
        &-5 {
          margin-left: $grid-gap;
        }
        &-3,
        &-6,
        &-7 {
          margin-right: $grid-gap;
        }
      }
    }
  }
  @media screen and (max-width: $breakpoint__desktop--max) {
    .posts-feed .posts-feed__transition .posts-feed-item {
      height: 30.4vw;
    }
    &.posts--filtering {
      margin-top: -2rem;
    }
  }
  @media screen and (max-width: $breakpoint__small-desktop--max) {
    .posts-feed .posts-feed__transition {
      width: calc(105% + 7rem);
      padding-right: 2rem;
      .posts-feed-item {
        height: 35.81vw;
      }
    }
  }
  @media screen and (max-width: $breakpoint__tablet--max) {
    margin-top: 5rem;
    min-height: 100vh;
    &.posts--filtering {
      padding-top: 6rem;
      margin-top: 0;
    }
    .posts-feed .posts-feed__transition {
      width: 100%;
      margin-top: 8rem;
      top: -8.5vw;
      padding-top: 0;
      padding-right: 0;
      padding-left: 0;
      margin-left: 0;
      overflow: visible;
      flex-direction: column;
      .posts-feed-item {
        transition-property: opacity;
        margin-bottom: $grid-gap;
        width: 100%;
        height: 23vw;
        margin-left: 0;
        margin-right: 0;
        right: 0;
        left: 0;
        &.reordering {
          &-enter,
          &-leave-active {
            width: 100%;
            height: 0;
            margin: 0;
          }
          &-enter-active {
            width: 100%;
            &.posts-feed-item--size {
              &-0,
              &-4,
              &-8,
              &-9 {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: $breakpoint__small-tablet--max) {
    .posts-feed .posts-feed__transition .posts-feed-item {
      height: 55vw;
    }
  }
  @media screen and (max-width: $breakpoint__mobile--max) {
    .posts-feed .posts-feed__transition {
      margin-top: 5rem;

      .posts-feed-item {
        margin-bottom: 12vw;
        height: 108vw;
      }
    }
  }
}
</style>
