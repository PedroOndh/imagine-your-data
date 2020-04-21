<template>
  <div class="footer">
    <div
      class="footer__first-row"
      :style="{
        'background-image': [
          quotes.length > 0
            ? `url(${quotes[currentQuote].attributes.image})`
            : 'none'
        ]
      }"
    >
      <Quote :quote="quotes[currentQuote]" :change-quote="changeQuote" />
    </div>
    <div class="footer__second-row">
      <p>
        <b>
          We use cookies, just to track visits to our website, we store no
          personal details.
        </b>
        <nuxt-link to="/privacy-policy">Privacy Policy</nuxt-link> -
        <nuxt-link to="/cookie-policy"><b>Cookie Policy</b></nuxt-link>
      </p>
    </div>
  </div>
</template>

<script>
import Quote from '~/components/common/footer/Quote'
async function getQuotes() {
  const context = await require.context('~/content/quotes', true, /\.md$/)
  const availableQuotes = await context.keys().map((key) => {
    return { ...context(key) }
  })
  return availableQuotes
}
export default {
  name: 'PageFooter',
  components: { Quote },
  data() {
    return {
      quotes: [
        {
          attributes: {
            image: ''
          }
        }
      ],
      currentQuote: 0
    }
  },
  async beforeCreate() {
    const quotes = await getQuotes()
    const currentQuote = Math.floor(Math.random() * quotes.length)
    this.$data.currentQuote = currentQuote
    this.$data.quotes = quotes
  },
  methods: {
    changeQuote(numberToAdd) {
      const { quotes, currentQuote } = this.$data
      const newCurrentQuote = currentQuote + numberToAdd
      if (newCurrentQuote >= 0) {
        this.$data.currentQuote = newCurrentQuote % quotes.length
      } else {
        this.$data.currentQuote = quotes.length - 1
      }
    }
  }
}
</script>

<style scoped lang="scss">
.footer {
  &__first-row {
    height: rem(396px);
    margin-top: rem(140px);
    background-size: cover;
    background-position: right;
    position: relative;
    @media screen and (max-width: $breakpoint__mobile--max) {
      height: auto;
      padding: 1rem 0;
    }
  }
  &__second-row {
    height: rem(82px);
    background-color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: rem(16px);
    font-weight: bold;
    p {
      margin-bottom: rem(4px);
    }
    a {
      text-decoration: none;
      color: $corporative-yellow;
    }
    @media screen and (max-width: $breakpoint__tablet--max) {
      padding: 1rem;
      height: auto;
      text-align: center;
    }
  }
}
</style>
