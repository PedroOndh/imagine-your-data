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
      <SocialIcon />
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
