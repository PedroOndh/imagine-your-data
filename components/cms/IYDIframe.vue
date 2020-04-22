<template>
  <iframe :src="src" :style="`height: ${height}`"></iframe>
</template>

<script>
export default {
  name: 'IYDIframe',
  props: {
    src: {
      type: String,
      default() {}
    },
    desktopHeight: {
      type: String,
      default() {}
    },
    tabletHeight: {
      type: String,
      default() {}
    },
    mobileHeight: {
      type: String,
      default() {}
    }
  },
  data() {
    let height
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    if (this.mobileHeight && width <= 449) {
      height = this.mobileHeight
    } else if (this.tabletHeight && width <= 1023) {
      height = this.tabletHeight
    } else {
      height = this.desktopHeight
    }
    return {
      height
    }
  }
}
</script>
