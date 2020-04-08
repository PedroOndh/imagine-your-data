<template>
  <div class="header">
    <div class="header__logo">
      <nuxt-link to="/">
        <div class="header__title">ImagineYourData</div>
        <div class="header__brand">
          wondered by
          <img src="/_media/empathy-co.svg" />
        </div>
      </nuxt-link>
    </div>
    <div class="header__sub-title">Visualising eCommerce Search & Browse</div>
    <div class="header__menu">
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

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: rem(100px) 0 rem(160px);
  width: 85%;
  margin: auto;
  &__logo {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    a {
      text-decoration: none;
    }
    .header__title {
      width: rem(347px);
      height: rem(39px);
      font-size: rem(31px);
      font-weight: 300;
      line-height: 1.39;
      letter-spacing: rem(2px);
      text-transform: uppercase;
      color: #243d48;
    }
    .header__brand {
      font-size: rem(10px);
      font-weight: 300;
      color: $grey-dark;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      line-height: 1;
      margin-right: rem(4px);
      img {
        margin-left: rem(8px);
      }
    }
  }
  &__sub-title {
    font-size: rem(13px);
    font-weight: 300;
    line-height: 0.92;
    color: $blue-dark;
  }
  &__menu {
    display: flex;
    align-items: center;
    .header__link {
      font-size: rem(19px);
      font-weight: 300;
      line-height: 2.26;
      text-transform: uppercase;
      text-decoration: none;
      color: $grey-light;
    }
    a {
      margin-right: rem(16px);
      &.social-icon {
        width: 48px;
        height: 48px;
      }
    }
  }
}
</style>
