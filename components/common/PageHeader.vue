<template>
  <div v-header class="header">
    <div class="container">
      <div class="header__logo">
        <nuxt-link to="/">
          <div class="header__title">ImagineYourData</div>
          <div class="header__brand">
            wondered by
            <img src="/_media/empathy-co.svg" />
          </div>
        </nuxt-link>
      </div>
      <div class="header__sub-title">Visualizing eCommerce Search & Browse</div>
      <div class="header__menu">
        <nuxt-link class="header__link" to="/about">About</nuxt-link>
        <SocialIcon social="instagram" />
        <SocialIcon social="twitter" />
        <SocialIcon social="linkedin" />
      </div>
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
  padding: rem(100px) 0 0;
  position: absolute;
  width: 100%;
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
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
  &--fixed {
    padding: 0;
    position: fixed;
    width: 100%;
    z-index: 2;
    background: white;
    .container {
      padding: 0.6rem 0px 0.9rem;
      .header__logo {
        .header__title {
          transition: all 0.3s ease;
          font-size: 1.5rem;
          width: auto;
          height: auto;
        }
      }
      .header__menu {
        a.social-icon {
          transition: all 0.3s ease;
          width: 40px;
          height: 40px;
        }
      }
    }
  }
  @media screen and (max-width: $breakpoint__tablet--max) {
    .container {
      flex-direction: column;
      .header__sub-title {
        padding: 1rem 0;
        text-align: center;
        line-height: 1.5;
      }
      .header__menu a.social-icon {
        width: 35px;
        height: 35px;
        margin-right: 0.5rem;
      }
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
