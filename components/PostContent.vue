<template>
  <!-- eslint-disable-next-line -->
  <div class="blog-post__content" v-html="content" />
</template>

<script>
import activateLightbox from '~/assets/libs/lightbox'
export default {
  name: 'PostContent',
  props: {
    content: {
      type: String,
      default() {}
    }
  },
  mounted() {
    activateLightbox()
  }
}
</script>

<style lang="scss">
.blog-post__content {
  padding-bottom: 10rem;
  h2,
  h3 {
    color: #243d48;
    font-size: rem(50px);
    font-weight: 300;
    padding: rem(40px) 0 rem(30px);
  }
  p,
  ul li {
    font-family: 'Lora', serif;
    font-size: rem(22px);
    line-height: 1.83;
    color: #747474;
    a {
      color: $link-blue;
      font-weight: bold;
    }
  }
  p {
    padding-bottom: rem(40px);
  }
  ul {
    padding-left: 0;
    padding-bottom: 20px;
    li {
      padding-bottom: rem(20px);
    }
  }
  img {
    width: 100%;
    margin: rem(40px) 0;
  }
  iframe {
    margin-bottom: rem(40px);
    &.youtube-video {
      height: 30vw;
    }
  }
}
$mask-background-color: rgba(255, 255, 255, 0.8);
.lightbox {
  cursor: pointer;

  &__container {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 3;
    animation: maskIn $transitions-duration forwards;

    &--animation-close {
      animation: maskOut $transitions-duration forwards;
    }
  }

  &__content {
    cursor: pointer;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 5rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__media {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: auto;
    object-fit: contain;
    padding: 1rem;
    transition-duration: 0ms;
    transition: transform $transitions-duration--short ease-out, width ease-out;

    &--initial-position {
      transform: scale(1) translate3d(0, 0, 0) !important;
      width: 100%;
    }
  }

  &__close-btn {
    position: fixed;
    top: rem(14px);
    right: rem(20px);
    font-size: rem(18px);
    color: black;
    cursor: pointer;
  }

  @keyframes maskIn {
    0% {
      background: transparent;
    }
    100% {
      background: $mask-background-color;
    }
  }

  @keyframes maskOut {
    0% {
      background: $mask-background-color;
    }
    100% {
      background: transparent;
    }
  }
  @media only screen and (max-width: $breakpoint__mobile--max) {
    &__media--images {
      max-width: rem(350px);
      padding: rem(25px);
    }
  }
}
</style>
