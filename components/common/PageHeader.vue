<template>
  <div class="header">
    <div>
      <div class="header__title">
        <img src="/_media/internal-nuxt-image.jpg" />
        Imagine Your Data
        <Arrow />
      </div>
    </div>
    <div>
      <div class="header__subTitle">Visualising eCommerce Search & Browse</div>
    </div>
    <div>
      <nuxt-link class="header__link" to="/about">About</nuxt-link>
      <SocialIcon
        href="https://www.instagram.com/empathy_co/?hl=en"
        image="instagram.svg"
        alt="Instagram"
      />
      <SocialIcon
        href="https://twitter.com/empathyco_?lang=en"
        image="twitter.svg"
        alt="Twitter"
      />
      <SocialIcon
        href="https://www.linkedin.com/company/empathyco"
        image="linkedin.svg"
        alt="LinkedIn"
      />
    </div>
  </div>
</template>

<script>
import SocialIcon from '~/components/common/SocialIcon'
import Arrow from '~/static/_media/arrow.svg?inline'

export default {
  name: 'PageHeader',
  components: { SocialIcon, Arrow }
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  img {
    width: 3rem;
    height: 3rem;
  }
}
</style>
