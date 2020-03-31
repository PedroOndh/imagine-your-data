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

async function getPostsFromSource(firstIndex, lastIndex) {
  const context = await require.context('~/content/blog', true, /\.md$/)
  const availablePosts = context.keys()
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
      posts: await getPostsFromSource(0, 10)
    }
  },
  data() {
    return {
      currentPostList: 0,
      availablePosts: 0,
      observer: ''
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
      this.observe()
    },
    async getPosts() {
      const { currentPostList, posts } = this.$data
      const prevPostList = currentPostList
      const nextPostList = prevPostList + 1
      const newPosts = await getPostsFromSource(
        prevPostList * 10,
        nextPostList * 10
      )
      console.log('getPosts newPosts ', newPosts)
      this.$data.currentPostList = nextPostList
      this.$data.posts = [...posts, ...newPosts]
      setTimeout(function() {
        this.observe()
      }, 2000)
    },
    observe() {
      const { currentPostList, observer } = this.$data
      const nextIdToSelect = (currentPostList * 10 + 9).toString()
      const nextLastPost = document.getElementById(nextIdToSelect)
      if (nextLastPost) {
        observer.observe(nextLastPost)
      }
    },
    unobserve() {
      const { currentPostList, observer } = this.$data
      const prevIdToSelect = (currentPostList * 10 - 1).toString()
      const prevLastPost = document.getElementById(prevIdToSelect)
      if (prevLastPost) {
        observer.unobserve(prevLastPost)
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
