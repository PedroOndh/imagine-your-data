<template>
  <div class="header container">
    <div class="header__logo">
      <nuxt-link to="/">
        <div class="header__title">ImagineYourData</div>
        <div class="header__brand">
          wondered by
          <img src="/_media/empathy-co.svg" />
        </div>
      </nuxt-link>
    </div>
    <div class="header__sub-title">Data for Creativity</div>
    <div class="header__menu">
      <nuxt-link class="header__link" to="/about">About</nuxt-link>
      <SocialIcon social="instagram" />
      <SocialIcon social="twitter" />
      <SocialIcon social="linkedin" />
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
    color: $corporative-blue;
    text-align: center;
    margin-left: 1rem;
    margin-right: 1rem;
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
  @media screen and (max-width: $breakpoint__tablet--max) {
    flex-direction: column;
    padding-bottom: 6rem;
    &__sub-title {
      padding: 1rem 0;
      text-align: center;
      line-height: 1.5;
    }
    &__menu a.social-icon {
      width: 35px;
      height: 35px;
      margin-right: 0.5rem;
    }
  }
  @media screen and (max-width: $breakpoint__mobile--max) {
    &__logo {
      width: 100%;
      align-items: center;
      .header__title {
        font-size: 7vw;
        width: 100%;
      }
    }
  }
}
</style>
