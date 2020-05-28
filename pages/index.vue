<template>
  <div>
    <h1 class="home__catchphrase">{{ catchPhrase }}</h1>
    <Categories
      :categories="categories"
      :current-category="currentCategory"
      :filter-by-category="filterByCategory"
    />
    <PostFeed :posts="posts" />
  </div>
</template>

<script>
import Categories from '../components/home/Categories'
import PostFeed from '../components/home/PostFeed'
import { turnFileNameToPath, isDesktop } from '~/assets/js/utils'
import { catchPhrase } from '~/assets/js/consts'

const postsPerPage = 12

async function getAvailablePosts() {
  const context = await require.context('~/content/blog', true, /\.md$/)
  const availablePosts = await context
    .keys()
    .map((key) => ({
      ...context(key),
      _path: `/blog/${context(key).attributes.slug ||
        turnFileNameToPath(key.replace('./', ''))}`
    }))
    .sort(function(a, b) {
      return a.attributes.date > b.attributes.date ? -1 : 1
    })
  return await getPostAuthor(availablePosts)
}

async function getPostAuthor(posts) {
  const context = await require.context('~/content/authors', true, /\.md$/)
  const authors = await context.keys().map((key) => ({
    ...context(key)
  }))
  const postsWithAuthor = []
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const postAuthor = authors.find(
      (author) => author.attributes.email === post.attributes.author
    )
    post.attributes = {
      ...post.attributes,
      author: postAuthor
        ? {
            ...postAuthor.attributes
          }
        : undefined,
      index: i
    }
    postsWithAuthor.push(post)
  }
  return postsWithAuthor
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
  components: { Categories, PostFeed },
  async asyncData() {
    const availablePosts = await getAvailablePosts()
    return {
      availablePosts,
      filteredPosts: availablePosts,
      posts: availablePosts.slice(0, postsPerPage),
      categories: await getAvailableCategories(),
      catchPhrase
    }
  },
  data() {
    return {
      currentPostList: 1,
      observer: {},
      currentCategory: ''
    }
  },
  mounted() {
    this.registerObserver()
    this.prepareFixedCategories()
    this.scrollInView()
    this.moveChevron('')
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
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
      const idToSelect = (postList * postsPerPage - 4).toString()
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
        ? availablePosts.filter((item) => item.attributes.category === category)
        : availablePosts
      this.$data.currentCategory = category
      this.$data.filteredPosts = newFilteredPosts
      this.$data.posts = newFilteredPosts.slice(0, postsPerPage)
      this.$data.currentPostList = 1
      this.moveChevron(category)
      this.scrollInView()
      this.observe(1, true)
    },
    scrollInView() {
      const currentScroll = Math.abs(document.body.getBoundingClientRect().top)
      if (currentScroll > this.$data.categoriesTop) {
        window.scrollTo(0, this.$data.categoriesTop + 1)
      }
    },
    moveChevron(category) {
      const chevron = document.querySelector('.categories__selected-chevron')
      if (isDesktop()) {
        const categoryListItem = document.getElementById(category || 'all')
        const leftStyle =
          categoryListItem.offsetLeft + categoryListItem.offsetWidth / 2 - 10
        chevron.style.display = 'block'
        chevron.style.left = `${leftStyle}px`
      } else {
        chevron.style.display = 'none'
      }
    },
    prepareFixedCategories() {
      const header = document.querySelector('.header')
      const headerHeight = header.offsetHeight
      const posts = document.querySelector('.posts')
      const categories = document.querySelector('.categories')
      const categoriesTop = categories.offsetTop - headerHeight
      this.$data.categoriesTop = categoriesTop
      window.addEventListener('scroll', function(e) {
        const currentScroll = Math.abs(
          document.body.getBoundingClientRect().top
        )
        if (currentScroll > categoriesTop) {
          header.classList.add('header--filtering')
          posts.classList.add('posts--filtering')
          categories.classList.add('categories--fixed')
        } else {
          header.classList.remove('header--filtering')
          posts.classList.remove('posts--filtering')
          categories.classList.remove('categories--fixed')
        }
      })
    },
    resize() {
      this.moveChevron(this.currentCategory)
    }
  }
}
</script>

<style scoped lang="scss">
.home__catchphrase {
  font-weight: 300;
  line-height: 0.92;
  color: #0086b2;
  position: absolute;
  top: 16rem;
  left: 0;
  width: 100%;
  font-size: 3rem;
  margin: 0;
  text-align: center;
  @media screen and (max-width: $breakpoint__small-desktop--max) {
    top: 12rem;
    font-size: rem(32px);
  }
  @media screen and (max-width: $breakpoint__tablet--max) {
    display: none;
  }
}
</style>
