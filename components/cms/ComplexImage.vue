<template>
  <figure
    itemscope
    itemtype="http://schema.org/ImageObject"
    class="image-figcaption"
  >
    <img :src="image" :alt="caption" :class="lightbox ? 'lightbox' : ''" />
    <figcaption v-if="caption" itemprop="caption" class="text-centered">
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script>
export default {
  name: 'ComplexImage',
  props: {
    image: {
      type: String,
      default() {}
    },
    caption: {
      type: String,
      default() {}
    },
    lightbox: {
      type: String,
      default() {}
    }
  }
}
</script>

<style scoped>
.lightbox {
  cursor: pointer;
}
</style>
