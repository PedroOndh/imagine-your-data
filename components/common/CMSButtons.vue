<template>
  <aside class="cms-buttons">
    <button class="cms-buttons__deploy" @click="openPopup">Deploy</button>
    <a
      v-if="blog"
      class="cms-buttons__edit"
      :href="
        `https://dev.imagineyourdata.com/admin/#/collections/blog/entries/${filename}`
      "
    >
      Edit on CMS
    </a>
    <div v-if="open" class="cms-buttons__popup-container">
      <div v-if="open" class="cms-buttons__popup">
        Deploy is going to be performed. Are you sure you want to continue?
        <div class="cms-buttons__actions">
          <button class="cms-buttons__accept" @click="deploy">Accept</button>
          <button class="cms-buttons__cancel" @click="closePopup">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'CMSButtons',
  data() {
    return {
      open: false,
      blog: this.isBlog(),
      filename: this.getFilename()
    }
  },
  watch: {
    $route(to, from) {
      this.blog = this.isBlog()
      this.filename = this.getFilename()
    }
  },
  methods: {
    openPopup() {
      this.open = true
    },
    closePopup() {
      this.open = false
    },
    isBlog() {
      return this.$nuxt.$route.path.indexOf('blog') > 0
    },
    getFilename() {
      return this.isBlog() && this.$nuxt.$route.path.split('/')[2]
    },
    deploy() {
      this.closePopup()
    }
  }
}
</script>

<style scoped lang="scss">
.cms-buttons {
  position: fixed;
  z-index: 3;
  padding: 1rem;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  button {
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }
  & > button,
  & > a {
    background: $corporative-blue;
    border: none;
    border-radius: 1.25rem;
    padding: 0.5rem 1rem;
    margin: 0.2rem;
    text-transform: uppercase;
    font-size: 1rem;
    font-weight: $font-weight--semibold;
    color: white;
  }
  &__popup {
    background: white;
    border-radius: 1.25rem;
    border: 2px solid $corporative-blue;
    margin: 0.5rem 0.2rem;
    padding: 1rem 3rem;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  &__actions {
    margin-top: 1rem;
    button {
      text-transform: uppercase;
      font-weight: $font-weight--semibold;
      border: 1px solid $corporative-blue;
      border-radius: 1.25rem;
      margin: 0.2rem;
      padding: 0.5rem 1rem;
    }
  }
  &__accept {
    background: white;
  }
  &__cancel {
    color: white;
    background: $corporative-pink;
  }
}
</style>
