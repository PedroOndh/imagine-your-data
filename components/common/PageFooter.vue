<template>
  <div class="footer">
    <div class="footer__first-row">
      <div class="quote">
        <div class="quote__second-row">
          <img :src="quote.attributes.image" />
          <div class="quote__quote">
            {{ quote.attributes.quote }}
          </div>
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
    </div>
    <div class="footer__second-row">
      <p>
        We use cookies, just to track visits to our website, we store no
        personal details. Accept cookies - Cookie Policy
      </p>
    </div>
  </div>
</template>

<script>
import SocialIcon from '~/components/common/SocialIcon'
async function getQuote() {
  const context = await require.context('~/content/quotes', true, /\.md$/)
  const availableQuotes = await context.keys().map((key) => {
    return { ...context(key) }
  })
  const quote =
    availableQuotes[Math.floor(Math.random() * availableQuotes.length)]
  return {
    ...quote
  }
}

export default {
  name: 'PageFooter',
  components: { SocialIcon },
  data() {
    return {
      quote: {
        attributes: {}
      },
      image: ''
    }
  },
  async created() {
    const quote = await getQuote()
    this.$data.quote = { ...quote }
  }
}
</script>

<style scoped></style>
