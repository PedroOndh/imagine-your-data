<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="container__title">
        adrianarenal
      </h1>
      <h2 class="subtitle">
        My personal website with NuxtJs
      </h2>
      <div class="links">
        <a class="button--green" href="https://nuxtjs.org/" target="_blank">
          Documentation {{ test }}
        </a>
        <a
          class="button--grey"
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  computed: {
    test(): number {
      return 2
    }
  }
}
</script>

<style lang="scss">
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  &__title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system,
      BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      sans-serif;
    display: block;
    font-weight: 300;
    font-size: $font-size--extra-large;
    letter-spacing: 1px;
  }
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
