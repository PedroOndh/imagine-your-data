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

<style lang="scss">
$grid-gap: 2.19vw;
section.posts {
  margin-top: 12vw;
  padding-bottom: rem(140px);
  background-color: $grey-background;
  &.posts--filtering {
    padding-top: 15rem;
    margin-top: 0;
  }
  .posts-feed .posts-feed__transition {
    position: relative;
    top: -8.5vw;
    display: flex;
    flex-wrap: wrap;
    transition: all 1s ease;
    width: calc(105% + 5rem);
    overflow-y: hidden;
    padding: 5rem 0 5rem 5rem;
    margin-top: -5rem;
    margin-left: -5rem;

    .posts-feed-item {
      border-radius: rem(20px);
      box-shadow: 0 0 rem(75px) 0 #d2d2d2;
      margin-bottom: $grid-gap;
      width: 23.81%;
      height: rem(626px);
      transition-property: opacity, width, margin;
      transition-duration: 0.8s;
      &.reordering {
        &-enter {
          opacity: 0;
          width: 5%;
          margin-left: 0;
          margin-right: 0;
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
          width: calc(47.62% - 2 * 2.19vw);
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
      height: 32.6vw;
    }
    &.posts--filtering {
      margin-top: -5rem;
    }
  }
  @media screen and (max-width: $breakpoint__small-desktop--max) {
    .posts-feed .posts-feed__transition .posts-feed-item {
      height: 38vw;
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
      padding-top: 0;
      padding-left: 0;
      margin-left: 0;
      overflow: visible;
      .posts-feed-item {
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
            width: auto;
            height: 0;
          }
        }
      }
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
