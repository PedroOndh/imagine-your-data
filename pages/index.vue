<template>
  <div class="container">
    <h1 class="title">
      Imagine your data
    </h1>
    <section class="posts">
      <!-- eslint-disable-next-line -->
      <div v-for="(post, index) in posts" :key="index" :id="index" class="columns">
        <PostFeedItem :post="post" />
      </div>
    </section>
  </div>
</template>

<script>
import PostFeedItem from '../components/PostFeedItem'

const postsPerPage = 10
let availablePost

async function getPostsFromSource(firstIndex, lastIndex) {
  const context = await require.context('~/content/blog', true, /\.md$/)
  availablePost = context.keys().reverse()
  const posts = await context
    .keys()
    .reverse()
    .slice(firstIndex, lastIndex)
    .map((key) => ({
      ...context(key),
      _path: `/${key.replace('.md', '').replace('./', '')}`
    }))
  return posts
}
export default {
  components: { PostFeedItem },
  async asyncData() {
    return {
      posts: await getPostsFromSource(0, postsPerPage),
      availablePosts: availablePost
    }
  },
  data() {
    return {
      currentPostList: 1,
      availablePosts: [],
      observer: {},
      scroll: 0
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
        threshold: 0.7
      }

      const observer = new IntersectionObserver(this.getPosts, options)
      this.$data.observer = observer
      this.observe(1, true)
    },
    async getPosts() {
      const { currentPostList, availablePosts, posts } = this.$data
      if (
        currentPostList * postsPerPage < availablePosts.length &&
        Math.abs(document.body.getBoundingClientRect().top) !== 0
      ) {
        const prevPostList = currentPostList
        const nextPostList = prevPostList + 1
        const newPosts = await getPostsFromSource(
          prevPostList * postsPerPage,
          nextPostList * postsPerPage
        )
        this.observe(prevPostList, false)
        this.$data.currentPostList = nextPostList
        this.$data.posts = [...posts, ...newPosts]
        this.observe(nextPostList, true)
      }
    },
    observe(postList, observe) {
      const { observer } = this.$data
      const idToSelect = (postList * postsPerPage - 1).toString()
      const lastPost = document.getElementById(idToSelect)
      if (lastPost) {
        if (observe) {
          observer.observe(lastPost)
        } else {
          observer.unobserve(lastPost)
        }
      }
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
