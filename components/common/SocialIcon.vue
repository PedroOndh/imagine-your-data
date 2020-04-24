<template>
  <a class="social-icon" :href="href" target="_blank">
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
    social: {
      type: String,
      default: ''
    }
  },
  data() {
    let href
    let image
    let alt
    if (this.social === 'linkedin') {
      href = 'https://www.linkedin.com/company/empathyco'
      image = 'linkedin.svg'
      alt = 'LinkedIn'
    } else if (this.social === 'twitter') {
      href = 'https://twitter.com/empathyco_?lang=en'
      image = 'twitter.svg'
      alt = 'Twitter'
    } else if (this.social === 'instagram') {
      href = 'https://www.instagram.com/empathy_co/?hl=en'
      image = 'instagram.svg'
      alt = 'Instagram'
    }
    return {
      href,
      image,
      alt
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
