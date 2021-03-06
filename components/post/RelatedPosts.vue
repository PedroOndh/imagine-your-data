<template>
  <aside class="blog-post__related">
    <div class="small-container">
      <div class="related-post__filtering-method">By {{ filteringMethod }}</div>
      <div
        v-for="(post, index) in relatedPosts"
        :key="index"
        class="related-post"
      >
        <nuxt-link :to="post._path">
          <img
            :src="post.attributes.image"
            :alt="post.attributes.title"
            class="related-post__image"
          />
          <h3 class="related-post__title">{{ post.attributes.title }}</h3>
        </nuxt-link>
      </div>
    </div>
  </aside>
</template>

<script>
import { turnFileNameToPath, trunc } from '~/assets/js/utils'

export default {
  name: 'RelatedPosts',
  props: {
    currentPost: {
      type: Object,
      default() {}
    },
    currentAuthor: {
      type: Object,
      default() {}
    }
  },
  data() {
    return {
      relatedPosts: [],
      filteringMethod: ''
    }
  },
  async created() {
    const relatedPosts = await this.getAvailablePosts(this.$props.currentPost)
    relatedPosts.forEach((post) => {
      post.attributes = {
        ...post.attributes,
        title: trunc(post.attributes.title, 50, true)
      }
    })
    this.$data.relatedPosts = relatedPosts
  },
  methods: {
    async getAvailablePosts(currentPost) {
      const context = await require.context('~/content/blog', true, /\.md$/)
      const keys = context.keys()
      const availablePosts = await keys
        .map((key) => ({
          ...context(key),
          _path: `/blog/${turnFileNameToPath(
            key.replace('.md', '').replace('./', '')
          )}`
        }))
        .filter(
          (post) => post.attributes.title !== currentPost.attributes.title
        )
      if (this.$props.currentAuthor.attributes) {
        const postsByAuthor = await availablePosts.filter(
          (post) => post.attributes.author === currentPost.attributes.author
        )
        if (postsByAuthor.length >= 3) {
          this.$data.filteringMethod = this.$props.currentAuthor.attributes.nickname
          return postsByAuthor.slice(0, 3)
        }
      }
      const postsByCategory = await availablePosts.filter(
        (post) => currentPost.attributes.category === post.attributes.category
      )
      if (postsByCategory.length >= 3) {
        this.$data.filteringMethod = 'category'
        return postsByCategory.slice(0, 3)
      }
      const randomNumber = Math.floor(
        Math.random() * (availablePosts.length - 3)
      )
      return availablePosts.slice(randomNumber, randomNumber + 3)
    }
  }
}
</script>

<style scoped lang="scss">
.blog-post__related {
  background: $grey-background;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: rem(150px) 0 rem(215px);
  .small-container {
    display: flex;
    justify-content: space-between;
    position: relative;
  }
  .related-post {
    width: 33%;
    a {
      display: flex;
      align-items: center;
      height: 100%;
      img {
        width: 50%;
        max-width: rem(183px);
        height: rem(119px);
        margin-right: 7%;
        object-fit: cover;
      }
      h3 {
        width: 50%;
        word-break: break-word;
        max-width: rem(370px);
        font-size: $font-size--small;
        line-height: 1.5;
        color: $grey-dark;
        display: flex;
        align-items: center;
      }
    }
    &__filtering-method {
      position: absolute;
      top: -5rem;
      font-weight: $font-weight--bold;
      color: $grey-dark;
    }
  }
  @media screen and (max-width: $breakpoint__desktop--max) {
    padding-bottom: 20rem;
    .related-post {
      a h3 {
        font-size: $font-size--extra-small;
      }
    }
  }
  @media screen and (max-width: $breakpoint__small-desktop--max) {
    .related-post {
      width: 100%;
      padding: 0 1rem;
      a {
        display: flex;
        flex-direction: column;
        img,
        h3 {
          max-width: none;
          width: 100%;
          margin-right: 0;
          margin-bottom: 2rem;
        }
      }
    }
  }
  @media screen and (max-width: $breakpoint__tablet--max) {
    padding-bottom: rem(50px);
    .small-container {
      flex-direction: column;
    }
    .related-post {
      padding: 0;
    }
  }
  @media screen and (max-width: $breakpoint__mobile--max) {
    .related-post a img {
      height: 10rem;
    }
  }
}
</style>
