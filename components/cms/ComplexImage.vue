<template>
  <figure
    itemscope
    itemtype="http://schema.org/ImageObject"
    :class="
      `image-figcaption  ${
        caption ? 'figure--caption' : ''
      } figure--caption-${captionAlignment}`
    "
  >
    <img
      :src="image"
      :alt="caption"
      :class="`figure-image ${lightbox ? 'lightbox' : ''}`"
    />
    <img v-if="lightbox" class="lightbox-icon" src="/_media/expand.svg" />
    <figcaption v-if="caption" itemprop="caption">
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
    captionAlignment: {
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
  margin-right: 0;
}
.image-figcaption {
  overflow: hidden;
  img.figure-image {
    margin-bottom: 0;
  }
  figcaption {
    height: 100%;
    background: rgba(83, 185, 201, 0.18);
    padding: rem(24px) rem(20px);
    font-size: rem(14px);
    line-height: 1.9;
    font-family: Lora;
    color: #163046;
    text-align: center;
  }
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
    pointer-events: none;
  }
  .image-figcaption {
    position: relative;

    &.figure--caption {
      width: 90%;
      margin-left: 5%;

      img.figure-image {
        width: 80%;
        margin: 0 20% 0 0;
      }
    }
    figcaption {
      position: absolute;
      width: 20%;
      top: 0;
      right: 0;
      text-align: left;
    }
    &.figure--caption.figure--caption-right {
      .lightbox-icon {
        margin-right: 20%;
      }
    }
    &.figure--caption.figure--caption-left {
      img.figure-image {
        margin: 0 0 0 20%;
      }
      figcaption {
        left: 0;
      }
    }
    &.figure--caption.figure--caption-center {
      width: 70%;
      margin: 0 15%;
      img.figure-image {
        width: 100%;
        margin: 0;
      }
      figcaption {
        width: 100%;
        text-align: center;
        position: initial;
      }
    }
  }
}
</style>
