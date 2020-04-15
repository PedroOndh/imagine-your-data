<template>
  <div class="blog-post">
    <div class="small-container">
      <h1 class="blog-post__title">
        {{ blogPost.attributes.title }}
      </h1>
      <div class="blog-post__author">
        <img :src="author.attributes.image" :alt="author.attributes.name" />
        <div class="blog-post__author-content">
          <span class="blog-post__author-date">{{ date }}</span>
          <span class="blog-post__author-name">
            By {{ author.attributes.name }}
            {{
              author.attributes.jobtitle
                ? `, ${author.attributes.jobtitle}`
                : ''
            }}
          </span>
        </div>
      </div>
      <!-- eslint-disable-next-line -->
      <div class="blog-post__content" v-html="blogPost.html" />
    </div>
    <div class="blog-post__share">
      Share if you liked it!
      <div class="blog-post__share-social">
        <SocialIcon social="twitter" />
        <SocialIcon social="linkedin" />
      </div>
    </div>
    <div class="blog-post__related">
      <div
        v-for="(post, index) in relatedPosts"
        :key="index"
        class="related-post"
      >
        <nuxt-link :to="post._path">
          <img :src="post.attributes.image" class="related-post__image" />
          <h3 class="related-post__title">{{ post.attributes.title }}</h3>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.blog-post {
  &__title {
    font-size: rem(73px);
    font-weight: 300;
    line-height: 1.22;
    text-align: center;
    color: $grey-medium;
    margin-bottom: rem(75px);
  }
  &__author {
    margin-bottom: rem(85px);
    display: flex;
    img {
      width: rem(92px);
      height: rem(92px);
      margin-right: rem(15px);
      border-radius: 50%;
    }
    &-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &-date {
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    &-name {
      font-family: 'Lora', serif;
      font-size: rem(25px);
      color: #747474;
    }
  }
  &__content {
    padding-bottom: 10rem;
    h2,
    h3 {
      color: $grey-dark;
      font-size: rem(50px);
      font-weight: 300;
      padding: rem(40px) 0 rem(30px);
    }
    p {
      font-family: 'Lora', serif;
      font-size: rem(22px);
      line-height: 1.83;
      color: #747474;
      padding-bottom: rem(40px);
      a {
        color: $link-blue;
        font-weight: bold;
      }
    }
    img {
      width: 100%;
      margin: rem(40px) 0;
    }
  }
  &__share {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-transform: uppercase;
    &-social {
      margin: rem(36px) 0 rem(50px);
      display: flex;
      a {
        margin: 0 rem(2.5px);
      }
    }
  }
  &__related {
    background: #f5f6f7;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: rem(150px);
    padding-bottom: rem(215px);
    padding-left: rem(69px);
    padding-right: rem(69px);
    .related-post {
      max-width: 33%;
      a {
        display: flex;
        align-items: center;
        img {
          width: 50%;
          max-width: rem(183px);
          height: rem(119px);
          margin-right: rem(39px);
          object-fit: cover;
        }
        h3 {
          width: 50%;
          max-width: rem(370px);
          font-size: rem(28px);
          line-height: 1.5;
          color: $grey-dark;
          display: flex;
          align-items: center;
        }
      }
    }
    @media screen and (max-width: $breakpoint__tablet--max) {
      flex-direction: column;
    }
  }
}
</style>
<script>
import SocialIcon from '~/components/common/SocialIcon'
import turnFileNameToPath from '~/assets/libs/turnFileNameToPath'

async function getAvailablePosts() {
  const context = await require.context('~/content/blog', true, /\.md$/)
  const keys = context.keys()
  const randomNumber = Math.floor(Math.random() * (keys.length - 3))
  const availablePosts = await keys
    .slice(randomNumber, randomNumber + 3)
    .map((key) => ({
      ...context(key),
      _path: `/blog/${turnFileNameToPath(
        key.replace('.md', '').replace('./', '')
      )}`
    }))
  return availablePosts
}
async function getPostAuthor(post) {
  const context = await require.context('~/content/authors', true, /\.md$/)
  const authors = await context.keys().map((key) => ({
    ...context(key)
  }))
  const postAuthor = authors.find(
    (author) => author.attributes.email === post.attributes.author
  )
  return postAuthor
}
function getDate(post) {
  const date = new Date(post.attributes.date)
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}
export default {
  components: { SocialIcon },
  layout: 'page',
  async asyncData({ route, error }) {
    try {
      const blogPost = await import(`~/content/blog/${route.name}.md`)
      const postAuthor = await getPostAuthor(blogPost)
      return {
        blogPost: { ...blogPost },
        author: { ...postAuthor },
        date: getDate(blogPost),
        relatedPosts: await getAvailablePosts()
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Not found' })
    }
  }
}
</script>
