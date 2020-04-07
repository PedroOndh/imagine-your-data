<template>
  <div class="footer">
    <div
      class="footer__first-row"
      :style="{ 'background-image': `url(${quote.attributes.image})` }"
    >
      <Quote :quote="quote" />
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
import Quote from '~/components/common/footer/Quote'
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
  components: { Quote },
  data() {
    return {
      quote: {
        attributes: {}
      }
    }
  },
  async beforeCreate() {
    const quote = await getQuote()
    this.$data.quote = { ...quote }
  }
}
</script>

<style scoped lang="scss">
.footer {
  &__first-row {
    height: rem(396px);
    margin-top: rem(80px);
    background-size: 100%;
  }
  &__second-row {
    height: rem(82px);
    background-color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;

    a {
      color: yellow;
    }
  }
}
</style>
