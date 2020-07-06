<template>
  <header
    v-header
    class="header"
    :class="{
      'header--not-home': !home
    }"
  >
    <div
      class="container header__container"
      :class="{
        'header__container--open': open
      }"
    >
      <div class="header__logo">
        <nuxt-link to="/">
          <div class="header__title">iMAGINEYOURDATA</div>
          <div class="header__brand">
            wondered by
            <img src="/_media/empathy-co.svg" alt="Empathy.co" />
          </div>
        </nuxt-link>
        <div class="header__button" @click="toggleMenu">
          <img
            class="header__button-closed"
            src="/_media/menu.svg"
            alt="Menu"
          />
          <img
            class="header__button-open"
            src="/_media/times-grey.svg"
            alt="Close menu"
          />
        </div>
      </div>
      <div class="header__sub-title">{{ catchPhrase }}</div>
      <div class="header__menu">
        <nuxt-link class="header__link" to="/about">About</nuxt-link>
        <div class="header__social">
          <SocialIcon social="instagram" />
          <SocialIcon social="twitter" />
          <SocialIcon social="linkedin" />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import SocialIcon from '~/components/common/SocialIcon'
import { catchPhrase } from '~/assets/js/consts'

export default {
  name: 'PageHeader',
  components: { SocialIcon },
  data() {
    return {
      open: false,
      home: true,
      catchPhrase
    }
  },
  watch: {
    $route(to, from) {
      this.open = false
      this.home = this.$nuxt.$route.path === '/'
    }
  },
  mounted() {
    this.home = this.$nuxt.$route.path === '/'
  },
  methods: {
    toggleMenu() {
      this.open = !this.open
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  margin: rem(100px) 0 0;
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
      transition: all $transitions-duration--short ease;
    }
    .header__title {
      width: rem(347px);
      height: rem(39px);
      font-size: rem(31px);
      font-weight: 300;
      line-height: 1.39;
      letter-spacing: rem(2px);
      color: $grey-dark;
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
  &__button {
    display: none;
  }
  &__sub-title {
    display: none;
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
    .header__social {
      display: flex;
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
    margin: 0;
    position: fixed;
    width: 100%;
    z-index: 3;
    background: white;
    .container {
      padding: 0.6rem 0px 0.9rem;
      .header__logo {
        .header__title {
          transition: all $transitions-duration--short ease;
          font-size: 1.5rem;
          width: auto;
          height: auto;
        }
      }
      .header__menu {
        a.social-icon {
          transition: all $transitions-duration--short ease;
          width: 40px;
          height: 40px;
        }
      }
    }
  }
  &--not-home,
  &--filtering {
    .header__sub-title {
      display: block;
    }
  }
  @media screen and (max-width: $breakpoint__small-desktop--max) {
    .container {
      .header__logo {
        .header__title {
          font-size: 1.5rem;
          width: auto;
          height: auto;
        }
      }
      .header__menu {
        a.social-icon {
          width: 40px;
          height: 40px;
        }
      }
      .header__sub-title {
        width: 12rem;
      }
    }
  }
  @media screen and (max-width: $breakpoint__tablet--max) {
    height: rem(80px);
    display: flex;
    margin: 0;
    .container {
      padding: 0.5rem 0;
      .header__logo {
        width: auto;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: auto;
        a {
          position: fixed;
          z-index: 1;
          top: 4rem;
          right: 10%;
          transition: all $transitions-duration ease;
          .header__title {
            transition: all $transitions-duration--short ease;
          }
          .header__brand img {
            margin-top: 0.1rem;
            margin-left: 0.3rem;
          }
        }
      }
      .header__button {
        transition: all $transitions-duration ease;
        display: block;
        width: rem(26px);
        height: rem(26px);
        position: relative;
        z-index: 2;
        &-open {
          position: absolute;
          top: 0;
          left: 0;
          transition: all 0.2s ease;
          transform: rotate(-90deg);
          opacity: 0;
        }
        &-closed {
          position: absolute;
          top: 0;
          left: 0;
          transition: all 0.2s ease;
          transform: rotate(0deg);
          opacity: 1;
        }
      }
      .header__sub-title {
        display: block;
        width: auto;
        margin-right: 0;
        margin-top: 0;
        position: relative;
        z-index: 1;
        opacity: 1;
        transition: all $transitions-duration ease;
      }
      .header__menu {
        background: white;
        flex-direction: column;
        position: absolute;
        transition: all $transitions-duration ease;
        z-index: 1;
        top: 0;
        left: 0;
        opacity: 0;
        height: 0;
        padding-top: 0;
        width: 100%;
        overflow: hidden;
        .header__link {
          color: #292929;
          margin: 0.5rem 0;
        }
        .header__social {
          margin: 3rem 0 rem(64px);
        }
        a.social-icon {
          width: 40px;
          height: 40px;
          margin-right: 0.5rem;
        }
      }
    }
    .container.header__container--open {
      .header__menu {
        opacity: 1;
        height: auto;
        background: white;
        padding-top: rem(140px);
      }
      .header__button {
        &-open {
          transform: rotate(0);
          opacity: 1;
        }
        &-closed {
          transform: rotate(90deg);
          opacity: 0;
        }
      }
    }
    &--fixed {
      .container {
        height: 100%;
        .header__sub-title {
          margin-top: -3rem;
          opacity: 0;
          transition: all $transitions-duration--short ease;
        }
        .header__logo {
          a {
            position: fixed;
            top: 1.3rem;
            .header__title {
              font-size: 1.2rem;
            }
            .header__brand {
              font-size: 0.5rem;
              img {
                width: 6rem;
              }
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: $breakpoint__mobile--max) {
    .container {
      .header__sub-title {
        width: auto;
      }
      .header__logo {
        align-items: center;
        a {
          right: 7.5%;
          top: 5rem;
        }
        .header__title {
          font-size: 7.7vw;
        }
      }
    }
    &--fixed {
      .container {
        .header__logo a {
          top: 1.5rem;
          .header__title {
            font-size: 1rem;
          }
          .header__brand img {
            width: 5rem;
          }
        }
      }
    }
  }
  @media screen and (max-width: 400px) {
    .container {
      .header__sub-title {
        font-size: 0.65rem;
      }
      .header__logo .header__title {
        font-size: 7.5vw;
      }
    }
  }
}
</style>
