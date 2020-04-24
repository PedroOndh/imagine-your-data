<template>
  <div class="quote">
    <div class="quote__first-row">
      <div class="quote__quote">" {{ quote.attributes.quote }} "</div>
      <div class="quote__author">
        <span class="quote__author-name">
          {{ quote.attributes.author }}
        </span>
        <span class="quote__author-occupation">
          • {{ quote.attributes.occupation }}
        </span>
      </div>
    </div>
    <div class="quote__second-row">
      <div class="quote__social-icons">
        <SocialIcon social="twitter" />
        <SocialIcon social="instagram" />
        <SocialIcon social="linkedin" />
      </div>
      <div class="quote__navigation">
        <div class="quote__arrow" @click="changeQuote(-1)">
          <img src="/_media/arrow-left.png" alt="arrow left" />
        </div>
        <div class="quote__arrow" @click="changeQuote(1)">
          <img src="/_media/arrow-right.png" alt="arrow right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SocialIcon from '~/components/common/SocialIcon'

export default {
  name: 'Quote',
  components: { SocialIcon },
  props: {
    quote: {
      type: Object,
      default() {}
    },
    changeQuote: {
      type: Function,
      default() {}
    }
  }
}
</script>

<style scoped lang="scss">
.quote {
  width: 75%;
  padding: rem(68px) rem(79px) rem(46px);
  border-radius: rem(20px);
  background-color: #fff;
  position: relative;
  bottom: rem(63px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &__first-row {
  }
  &__quote {
    font-family: Montserrat;
    font-size: rem(24px);
    font-weight: 300;
    line-height: 1.92;
    letter-spacing: 0.96px;
    color: $grey-dark;
  }
  &__author {
    font-size: 16px;
    line-height: 2;
    margin-top: 0.7rem;
    margin-bottom: rem(20px);
    &-name {
      font-weight: bold;
      color: $grey-dark;
    }
    &-occupation {
      font-weight: 300;
    }
  }
  &__second-row {
    display: flex;
    justify-content: space-between;
    border-top: solid 1px $grey-light;
    padding: rem(22px) 0 0;
    align-items: center;
  }
  &__social-icons {
    display: flex;
    a {
      width: rem(42px);
      height: rem(42px);
      margin-right: rem(14px);
    }
  }
  &__navigation {
    display: flex;
  }
  &__arrow {
    width: rem(36px);
    height: rem(24px);
    cursor: pointer;
    margin-left: rem(26px);
  }
  @media screen and (max-width: $breakpoint__tablet--max) {
    width: 80%;
    padding: rem(40px) rem(40px) rem(46px);
    margin-left: 10%;
    &__quote {
      font-size: rem(22px);
      line-height: 1.5;
    }
  }
  @media screen and (max-width: $breakpoint__mobile--max) {
    width: 90%;
    margin-left: 5%;
    padding: 2rem 1rem;
    position: initial;
    &__quote {
      font-size: rem(22px);
      line-height: 1.5;
    }
    &__second-row {
      flex-direction: column;
    }
    &__navigation {
      width: 100%;
      padding-top: 2rem;
      justify-content: space-around;
    }
    &__arrow {
      margin: 0;
    }
  }
}
</style>
