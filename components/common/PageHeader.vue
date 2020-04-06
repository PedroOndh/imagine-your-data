<template>
  <div class="header">
    <div>
      <div class="header__title">Imagine Your Data</div>
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

export default {
  name: 'PageHeader',
  components: { SocialIcon }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}
</style>
