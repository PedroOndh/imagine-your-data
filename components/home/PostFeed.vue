<template>
  <section>
    <div class="container posts-feed">
      <!-- eslint-disable-next-line -->
      <PostFeedItem v-for="(post, index) in posts" :key="post.attributes.index" :id="post.attributes.index" :post="post" :size-index="index % 12"/>
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
  margin-top: rem(280px);
  padding-bottom: rem(140px);
  background-color: #f5f6f7;
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
      background: #fff;
      background-repeat: no-repeat;
      margin-bottom: $grid-gap;
      display: grid;
      &--size {
        &-0 {
          grid-row: span 2;
          grid-column: span 2;
          margin-right: $grid-gap * 2;
        }
        &-7 {
          grid-row: span 2;
          grid-column: span 2;
          margin-left: $grid-gap;
          margin-right: $grid-gap;
        }
        &-1 {
          grid-row: span 2;
          position: relative;
          right: $grid-gap;
        }
        &-2,
        &-4,
        &-6,
        &-8,
        &-9 {
          grid-row: span 2;
        }
        &-3,
        &-5 {
          grid-column: span 3;
          margin-right: $grid-gap;
        }
        &-10,
        &-11 {
          grid-column: span 3;
          margin-left: $grid-gap;
        }
      }
      &--background {
        &-0,
        &-1,
        &-2,
        &-3,
        &-4,
        &-5,
        &-6,
        &-7,
        &-8,
        &-9,
        &-10,
        &-11 {
          animation-name: appearing;
          animation-duration: 0.5s;
        }
        &-0 {
          background: $corporative-light-blue;
          background-image: url('/_media/background/background-0.png');
          background-size: 100%;
          background-position: 0 14%;
          background-repeat: no-repeat;
        }
        &-1 {
          background-image: url('/_media/background/background-1.png');
          background-size: 80%;
        }
        &-2 {
          background-image: url('/_media/background/background-2.png');
          background-size: 100%;
          background-position: 0 0;
        }
        &-3 {
          background: $corporative-pink;
          background-image: url('/_media/background/background-3.png');
          background-size: 100%;
          background-position: 0 -240%;
          background-repeat: no-repeat;
        }
        &-4 {
          background: $corporative-green;
          background-image: url('/_media/background/background-4.png');
          background-size: 100%;
          background-position: center;
        }
        &-5 {
          background-image: url('/_media/background/background-5.png');
          background-size: 60vw;
          background-position: 0 20%;
        }
        &-6 {
          background-image: url('/_media/background/background-6.png');
          background-size: 100%;
          background-position: 0 20%;
        }
        &-7 {
          background: $corporative-purple;
          background-image: url('/_media/background/background-0.png');
          background-size: 100%;
          background-position: 0 14%;
          background-repeat: no-repeat;
        }
        &-8 {
          background: #0086b2;
          background-image: url('/_media/background/background-8.png');
          background-size: 100%;
          background-position: 0 20%;
          background-repeat: no-repeat;
        }
        &-9 {
          background: $corporative-pink;
          background-image: url('/_media/background/background-9.png');
          background-size: 100%;
          background-repeat: no-repeat;
        }
        &-9:before {
          content: '';
          width: 100%;
          height: 17vw;
          background-image: url('/_media/background/background-9-before.png');
          background-size: 100%;
          background-position: 0 100%;
          background-repeat: no-repeat;
          position: absolute;
        }
        &-10 {
          background-image: url('/_media/background/background-10.png');
          background-size: 60vw;
          background-position: 0 20%;
        }
        &-11 {
          background: $corporative-green;
          background-image: url('/_media/background/background-3.png');
          background-size: 100%;
          background-position: 0 500%;
          background-repeat: no-repeat;
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
    @media screen and (max-width: $breakpoint__small-desktop--max) {
      grid-auto-rows: 19vw;
    }
    @media screen and (max-width: $breakpoint__tablet--max) {
      grid-template-columns: 1fr;
      grid-auto-rows: 25vw;
      .posts-feed-item {
        margin-bottom: $grid-gap;
        grid-row: span 1;
        grid-column: span 1;
        margin-left: 0;
        margin-right: 0;
        right: 0;
      }
    }
    @media screen and (max-width: $breakpoint__small-tablet--max) {
      grid-auto-rows: 50vw;
    }
    @media screen and (max-width: $breakpoint__mobile--max) {
      grid-auto-rows: 120vw;
    }
  }
}
</style>
