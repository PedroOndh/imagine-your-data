<template>
  <div class="container">
    <h1 class="title">
      {{ content.attributes.catchphrase }}
    </h1>
    <div
      v-for="(category, index) in categories"
      :key="index"
      class="category"
      @click="filterByCategory(category)"
    >
      {{ category }}
    </div>
    <div class="category" @click="filterByCategory">
      Stop filtering
    </div>
    <section class="posts">
      <!-- eslint-disable-next-line -->
      <div v-for="(post, index) in posts" :key="index" :id="index" class="columns">
        <PostFeedItem :post="post" />
      </div>
    </section>
  </div>
</template>

<style>
.category {
  background: indianred;
  padding: 1rem;
  margin: 1rem;
  color: white;
  font-weight: bold;
}
</style>

<script>
import PostFeedItem from '../components/PostFeedItem'
import turnFileNameToPath from '~/assets/libs/turnFileNameToPath'

const postsPerPage = 6

async function getAvailablePosts() {
  const context = await require.context('~/content/blog', true, /\.md$/)
  const availablePosts = await context
    .keys()
    .map((key) => ({
      ...context(key),
      _path: `/blog/${turnFileNameToPath(
        key.replace('.md', '').replace('./', '')
      )}`
    }))
    .sort(function(a, b) {
      return a.attributes.date > b.attributes.date ? -1 : 1
    })

  return availablePosts
}

async function getAvailableCategories() {
  const context = await require.context('~/content/categories', true, /\.md$/)
  const availableCategories = await context
    .keys()
    .map((key) => ({ ...context(key) }.attributes.name))

  return availableCategories
}

export default {
  layout: 'page',
  components: { PostFeedItem },
  async asyncData() {
    const availablePosts = await getAvailablePosts()
    const content = await import('~/content/pages/home.md')
    return {
      content: { ...content },
      availablePosts,
      filteredPosts: availablePosts,
      posts: availablePosts.slice(0, postsPerPage),
      categories: await getAvailableCategories()
    }
  },
  data() {
    return {
      currentPostList: 1,
      observer: {}
    }
  },
  mounted() {
    this.registerObserver()
  },
  methods: {
    registerObserver() {
      const options = {
        root: null,
        rootMargin: '200px',
        threshold: 0.5
      }

      const observer = new IntersectionObserver(this.getPosts, options)
      this.$data.observer = observer
      this.observe(1, true)
    },
    getPosts(entry) {
      const { currentPostList, filteredPosts, posts } = this.$data
      if (
        currentPostList * postsPerPage < filteredPosts.length &&
        entry[0].isIntersecting
      ) {
        this.observe(currentPostList, false)
        const nextPostList = currentPostList + 1
        const newPosts = filteredPosts.slice(
          currentPostList * postsPerPage,
          nextPostList * postsPerPage
        )
        this.$data.currentPostList = nextPostList
        this.$data.posts = [...posts, ...newPosts]
        this.observe(nextPostList, true)
      }
    },
    observe(postList, observe) {
      const { observer } = this.$data
      const idToSelect = (postList * postsPerPage - 1).toString()
      let targetPost = document.getElementById(idToSelect)

      if (observe) {
        const checkTargetPost = setInterval(() => {
          targetPost = document.getElementById(idToSelect)
          if (targetPost) {
            observer.observe(targetPost)
            clearInterval(checkTargetPost)
          }
        }, 100)
      } else if (targetPost) {
        observer.unobserve(targetPost)
      }
    },
    filterByCategory(category) {
      const { availablePosts } = this.$data
      const newFilteredPosts = category.length
        ? availablePosts.filter((item) =>
            item.attributes.categories.includes(category)
          )
        : availablePosts
      this.$data.filteredPosts = newFilteredPosts
      this.$data.posts = newFilteredPosts.slice(0, postsPerPage)
      this.$data.currentPostList = 1
      this.observe(1, true)
    }
  },
  head() {
    return {
      script: [
        { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }
      ]
    }
  }
}
</script>
