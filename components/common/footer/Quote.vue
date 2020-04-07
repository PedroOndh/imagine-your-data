<template>
  <div class="quote">
    <div class="quote__first-row">
      <div class="quote__quote">" {{ quote.attributes.quote }} "</div>
      <div class="quote__author">
        <span class="quote__author-name">
          {{ quote.attributes.author }}
        </span>
        <span class="quote__author-occupation">
          {{ quote.attributes.occupation }}
        </span>
      </div>
    </div>
    <div class="quote__second-row">
      <div class="quote__social-icons">
        <SocialIcon
          href="https://twitter.com/empathyco_?lang=en"
          image="twitter.svg"
          alt="Twitter"
        />
        <SocialIcon
          href="https://www.instagram.com/empathy_co/?hl=en"
          image="instagram.svg"
          alt="Instagram"
        />
        <SocialIcon
          href="https://www.linkedin.com/company/empathyco"
          image="linkedin.svg"
          alt="LinkedIn"
        />
      </div>
      <div class="quote__navigation">
        <div class="quote__arrow-left">|--</div>
        <div class="quote__arrow-right">--|</div>
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
    }
  }
}
</script>

<style scoped lang="scss">
.quote {
  width: 70%;
  padding: 0 4rem;
  margin-left: 5%;
  height: rem(292px);
  border-radius: rem(20px);
  background-color: #fff;
  position: relative;
  top: rem(-65px);
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  &__author,
  &__occupation {
    font-size: 16px;
    line-height: 2.88;
  }
  &__second-row {
    display: flex;
    justify-content: space-between;
    border-top: solid 1px $grey-light;
    padding: 1.5rem 0 0;
    align-items: center;
  }
  &__social-icons,
  &__navigation {
    display: flex;
  }
}
</style>
