<template>
  <div class="carousel-container">
    <transition-group class="carousel" :name="animation" tag="div">
      <vnodes :vnodes="slides[currentSlide]" />
    </transition-group>
    <div class="carousel-controls">
      <button class="carousel-controls__button" @click="changeSlide(-1)">
        &#60;
      </button>
      <button class="carousel-controls__button" @click="changeSlide(1)">
        &#62;
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Carousel',
  components: {
    Vnodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    const slides = this.$slots.default
    return {
      slides,
      animation: 'fade',
      currentSlide: 0
    }
  },
  mounted() {
    this.$el.style.height = '1000px'
  },
  methods: {
    changeSlide(number) {
      this.animation = number === 1 ? 'slide-next' : 'slide-prev'
      const newIndex =
        this.currentSlide + number >= 0
          ? (this.currentSlide + number) % this.slides.length
          : this.slides.length - 1
      this.currentSlide = newIndex
    }
  }
}
</script>

<style lang="scss">
.carousel-container .carousel {
  position: relative;
  overflow: hidden;

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
    transition: transform 0.5s ease-in-out;
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
    transform: translate(100%);
  }
  .slide-next-leave-to,
  .slide-prev-enter {
    transform: translate(-100%);
  }
}
</style>
