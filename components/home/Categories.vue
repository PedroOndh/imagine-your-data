<template>
  <div class="categories">
    <div class="categories__list">
      <div
        id="all"
        class="categories__list-item categories__list-item--active"
        @click="activateCategoryFilter('')"
      >
        All
      </div>
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
    activateCategoryFilter(category) {
      const { currentCategory, filterByCategory } = this.$props
      const categories = document.querySelectorAll('.categories__list-item')
      categories.forEach((category) => {
        category.classList.remove('categories__list-item--active')
      })
      if (!category || currentCategory === category) {
        filterByCategory('')
        const targetCategory = document.getElementById('all')
        targetCategory.classList.add('categories__list-item--active')
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
  margin-top: rem(80px);
  background: white;
  &__list {
    transition: all 0.2s ease;
    display: flex;
    flex-wrap: wrap;
    padding-top: rem(30px);
    justify-content: space-between;
    &-item {
      text-transform: uppercase;
      text-align: center;
      opacity: 0.3;
      color: $corporative-light-blue;
      padding: rem(15px) 1rem;
      cursor: pointer;
      transition: opacity 0.5s ease;
      &:before {
        content: 'showing ';
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      &:hover {
        opacity: 1;
      }
      &--active {
        opacity: 1;
        &:before {
          opacity: 1;
        }
      }
    }
  }
  &--fixed {
    transition: background 0.1s ease;
    background: $corporative-light-blue;
    border-bottom: 2px solid #f5f6f7;
    position: fixed;
    top: 4.3rem;
    z-index: 2;
    margin-top: 0;
    width: 100%;
    left: 0;
    .categories__list {
      width: 80%;
      margin: auto;
      padding-top: 0;
      .categories__list-item {
        color: white;
      }
    }
  }
  @media screen and (max-width: $breakpoint__desktop--max) {
    margin-top: 0;
  }
  @media screen and (max-width: $breakpoint__tablet--max) {
    &__list {
      &-item {
        &:before {
          display: flex;
        }
      }
    }
  }
  @media screen and (max-width: $breakpoint__mobile--max) {
    &__list {
      flex-direction: column;
      align-items: center;
      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}
</style>
