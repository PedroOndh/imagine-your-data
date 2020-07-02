<template>
  <div class="carousel-container">
    <transition-group class="carousel" :name="animation" tag="div">
      <ComplexImage
        :key="generatedSlides[currentSlide].key"
        v-lightbox="generatedSlides[currentSlide].lightbox"
        :image="generatedSlides[currentSlide].image"
        :caption="generatedSlides[currentSlide].caption"
        :caption-alignment="generatedSlides[currentSlide].caption_alignment"
        :lightbox="generatedSlides[currentSlide].lightbox"
      />
    </transition-group>
    <div class="carousel-controls">
      <button
        class="carousel-controls__button carousel-controls__button--prev"
        @click="changeSlide(-1)"
      >
        <Chevron />
      </button>
      <button
        class="carousel-controls__button carousel-controls__button--next"
        @click="changeSlide(1)"
      >
        <Chevron />
      </button>
    </div>
  </div>
</template>

<script>
import ComplexImage from '~/components/cms/ComplexImage'
import Chevron from '~/static/_media/chevron.svg?inline'

export default {
  name: 'Carousel',
  components: { ComplexImage, Chevron },
  props: {
    slides: {
      type: String,
      default() {}
    }
  },
  data() {
    const slides = JSON.parse(this.slides.split('|/').join('"'))
    const generatedSlides = slides.map((slide, index) => ({
      ...slide,
      key: index,
      lightbox: slide.lightbox && slide.lightbox.toString()
    }))
    return {
      generatedSlides,
      animation: 'fade',
      currentSlide: 0
    }
  },
  mounted() {
    this.loadImages()
  },
  methods: {
    changeSlide(number) {
      this.animation = number === 1 ? 'slide-next' : 'slide-prev'
      const newIndex =
        this.currentSlide + number >= 0
          ? (this.currentSlide + number) % this.generatedSlides.length
          : this.generatedSlides.length - 1
      this.currentSlide = newIndex
    },
    loadImages() {
      this.generatedSlides.forEach((slide) => {
        const image = new Image()
        image.src = slide.image
      })
    }
  }
}
</script>

<style lang="scss">
.carousel-container {
  position: relative;
  .carousel {
    position: relative;
    overflow: hidden;
    &-controls {
      position: absolute;
      top: 50%;
      width: 100%;
      display: flex;
      justify-content: space-between;
      &__button {
        background: transparent;
        border: none;
        cursor: pointer;
        transform: scale(2);
        &--prev {
          transform: scale(2) rotate(180deg);
        }
        g {
          fill: #6d7278;
        }
        &:focus {
          outline: none;
        }
      }
    }

    /* FADE IN */
    .fade-enter-active {
      transition: opacity 1s;
    }
    .fade-enter {
      opacity: 0;
    }

    .slide-next-enter-active,
    .slide-next-leave-active,
    .slide-prev-enter-active,
    .slide-prev-leave-active {
      transition: transform $transitions-duration ease-in-out;
    }
    .slide-next-enter,
    .slide-next-leave-to,
    .slide-prev-enter,
    .slide-prev-leave-to {
      position: absolute;
      top: 0;
    }
    .slide-next-enter,
    .slide-prev-leave-to {
      transform: translate(150%);
    }
    .slide-next-leave-to,
    .slide-prev-enter {
      transform: translate(-150%);
    }
  }
}
</style>
