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
import turnFileNameToPath from '~/assets/libs/turnFileNameToPath'

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
      _path: `/blog/${turnFileNameToPath(
        key.replace('.md', '').replace('./', '')
      )}`
    }))
    .sort(function(a, b) {
      return a.attributes.date > b.attributes.date ? -1 : 1
    })

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
    async getPosts(entry) {
      const { currentPostList, availablePosts, posts } = this.$data
      if (
        currentPostList * postsPerPage < availablePosts.length &&
        entry[0].isIntersecting
      ) {
        this.observe(currentPostList, false)
        const nextPostList = currentPostList + 1
        const newPosts = await getPostsFromSource(
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
      let lastPost = document.getElementById(idToSelect)

      if (observe) {
        const checkLastPostExist = setInterval(() => {
          if (document.getElementById(idToSelect)) {
            lastPost = document.getElementById(idToSelect)
            observer.observe(lastPost)
            clearInterval(checkLastPostExist)
          }
        }, 1000)
      } else if (lastPost) {
        observer.unobserve(lastPost)
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
