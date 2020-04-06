<template>
  <a class="social-icon" :href="href">
    <img
      class="social-icon__image"
      :src="
        `https://assets.empathybroker.com/resources/media/social-media/${image}`
      "
      :alt="alt"
    />
    <img
      class="social-icon__image--hover"
      :src="
        `https://assets.empathybroker.com/resources/media/social-media/active/${image}`
      "
      :alt="alt"
    />
  </a>
</template>

<script>
export default {
  name: 'SocialIcon',
  props: {
    href: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.social-icon {
  &__image {
    display: block;
    &--hover {
      display: none;
    }
  }
  &:hover {
    .social-icon__image {
      display: none;
      &--hover {
        display: block;
      }
    }
  }
}
</style>
