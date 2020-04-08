<template>
  <div class="categories">
    <div class="categories__list">
      <div
        v-for="(category, index) in categories"
        :id="category"
        :key="index"
        class="categories__list-item"
        @click="activateCategoryFilter(category)"
      >
        {{ category }}
      </div>
    </div>
    <div class="categories__button" @click="openCategories">
      Viewed by categories
      <Chevron class="categories__button-chevron" />
    </div>
  </div>
</template>

<script>
import Chevron from '~/static/_media/chevron.svg?inline'

export default {
  name: 'Categories',
  components: { Chevron },
  props: {
    categories: {
      type: Array,
      default() {}
    },
    currentCategory: {
      type: String,
      default() {}
    },
    filterByCategory: {
      type: Function,
      default() {}
    }
  },
  methods: {
    openCategories() {
      const categoriesList = document.querySelector('.categories__list')
      categoriesList.classList.toggle('categories__list--open')
      const categoriesButton = document.querySelector('.categories__button')
      categoriesButton.classList.toggle('categories__button--active')
    },
    activateCategoryFilter(category) {
      const { currentCategory, filterByCategory } = this.$props
      const categories = document.querySelectorAll('.categories__list-item')
      categories.forEach((category) => {
        category.classList.remove('categories__list-item--active')
      })
      if (currentCategory === category) {
        filterByCategory('')
      } else {
        const targetCategory = document.getElementById(category)
        targetCategory.classList.toggle('categories__list-item--active')
        filterByCategory(category)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.categories {
  border-top: solid 2px $blue-light;
  margin-top: rem(126px);
  &__list {
    height: 0;
    justify-content: space-around;
    transition: padding 0.5s ease;
    overflow: hidden;
    padding-top: 0;
    &-item {
      text-transform: uppercase;
      opacity: 0.3;
      color: $blue-light;
      padding: rem(15px) 0;
      cursor: pointer;
      transition: opacity 0.5s ease;
      &:hover,
      &--active {
        opacity: 1;
      }
    }
    &--open {
      display: flex;
      height: 100%;
      padding-top: rem(50px);
    }
  }
  &__button {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: rem(30px) 0;
    justify-content: center;
    text-transform: uppercase;
    color: $blue-light;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    &:hover {
      color: $blue-dark;
    }
    &.categories__button--active {
      flex-direction: column-reverse;
      color: $blue-dark;
      .categories__button-chevron {
        bottom: rem(21px);
        transform: rotate(90deg) scaleX(-1);
        g {
          fill: $blue-dark;
        }
      }
    }
    &-chevron {
      position: absolute;
      bottom: rem(-21px);
      transition: all 0.5s ease;
      transform: rotate(90deg) scaleX(1);
      g {
        fill: $blue-light;
      }
    }
  }
}
</style>
