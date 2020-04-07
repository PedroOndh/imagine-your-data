<template>
  <div class="categories">
    <div class="categories__list">
      <div
        v-for="(category, index) in categories"
        :key="index"
        class="categories__list-item"
        @click="filterByCategory(category)"
      >
        {{ category }}
      </div>
    </div>
    <div class="categories__button" @click="openCategories">
      Viewed by categories
    </div>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  props: {
    categories: {
      type: Array,
      default() {}
    },
    filterByCategory: {
      type: Function,
      default() {}
    }
  },
  methods: {
    openCategories({ target }) {
      const categoriesList = document.querySelector('.categories__list')
      categoriesList.classList.toggle('categories__list--open')
    }
  }
}
</script>

<style scoped lang="scss">
.categories {
  border-top: solid 2px $blue-light;
  &__list {
    display: none;
    justify-content: space-around;
    &-item {
      text-transform: uppercase;
      opacity: 0.3;
      color: $blue-light;
      padding: 1rem 0;
      cursor: pointer;
      transition: opacity 0.5s ease;
      &:hover {
        opacity: 1;
      }
    }
    &--open {
      display: flex;
    }
  }
  &__button {
    display: flex;
    justify-content: center;
    text-transform: uppercase;
    color: $blue-dark;
    cursor: pointer;
  }
}
</style>
