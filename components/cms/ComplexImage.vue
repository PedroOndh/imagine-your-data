<template>
  <figure
    itemscope
    itemtype="http://schema.org/ImageObject"
    :class="`image-figcaption  ${caption ? 'figure--caption' : ''}`"
  >
    <img
      :src="image"
      :alt="caption"
      :class="`figure-image ${lightbox ? 'lightbox' : ''}`"
    />
    <img v-if="lightbox" class="lightbox-icon" src="/_media/expand.svg" />
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

<style scoped lang="scss">
.lightbox-icon {
  display: none;
}
@media screen and (min-width: $breakpoint__small-desktop--min) {
  .lightbox {
    cursor: pointer;
  }
  .lightbox-icon {
    display: block;
    padding: 0.5rem;
    width: 3rem;
    height: 3rem;
    top: 0.5rem;
    right: 0.5rem;
    position: absolute;
    margin-right: 15%;
    pointer-events: none;
  }
  .figure--caption {
    .lightbox-icon {
      margin-right: 20%;
    }
  }
}
</style>
