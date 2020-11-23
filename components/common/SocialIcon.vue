<template>
  <a
    class="social-icon"
    :href="share ? currentSocial.shareHref : currentSocial.href"
    target="_blank"
    rel="noopener"
  >
    <img
      class="social-icon__image"
      :src="
        `https://assets.empathybroker.com/resources/media/social-media/${currentSocial.image}`
      "
      :alt="currentSocial.alt"
    />
    <img
      class="social-icon__image--hover"
      :src="
        `https://assets.empathybroker.com/resources/media/social-media/active/${currentSocial.image}`
      "
      :alt="currentSocial.alt"
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
    },
    share: {
      type: Boolean,
      default: false
    },
    path: {
      type: String,
      default: ''
    },
    post: {
      type: Object,
      default() {}
    }
  },
  data() {
    return {
      socialMediaData: {
        linkedin: {
          href: 'https://www.linkedin.com/company/empathyco',
          shareHref:
            this.share && this.post
              ? `https://www.linkedin.com/shareArticle?mini=true&url=https://www.imagineyourdata.com${
                  this.path
                }&title=${encodeURIComponent(
                  this.post.attributes.title
                )}&summary=${this.post.attributes.seo_description ||
                  ''}&source=ImagineYourData`
              : '',
          image: 'linkedin.svg',
          alt: 'LinkedIn'
        },
        twitter: {
          href: 'https://twitter.com/imagineyourdata',
          shareHref:
            this.share && this.post
              ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  this.post.attributes.title
                )}&url=https://www.imagineyourdata.com${
                  this.path
                }&hashtags=ImagineYourData`
              : '',
          image: 'twitter.svg',
          alt: 'Twitter'
        },
        instagram: {
          href: 'https://www.instagram.com/imagineyourdata/',
          shareHref: '',
          image: 'instagram.svg',
          alt: 'Instagram'
        }
      }
    }
  },
  computed: {
    currentSocial() {
      return this.socialMediaData[this.social]
    }
  }
}
</script>

<style scoped lang="scss">
.social-icon {
  img {
    width: 100%;
  }
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
