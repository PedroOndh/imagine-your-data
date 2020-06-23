<template>
  <div class="blog-post">
    <article class="small-container">
      <h1 class="blog-post__title page-title">
        {{ blogPost.attributes.title }}
      </h1>
      <div class="blog-post__author">
        <img :src="author.attributes.image" :alt="author.attributes.name" />
        <div class="blog-post__author-content">
          <!--
          <span class="blog-post__author-date">{{ date }}</span>
          -->
          <span class="blog-post__author-name">
            By {{ author.attributes.name
            }}{{
              author.attributes.jobtitle
                ? `, ${author.attributes.jobtitle}`
                : ''
            }}
          </span>
        </div>
      </div>
      <client-only>
        <PostContent :content="blogPost.html" />
      </client-only>
    </article>
    <div class="blog-post__share">
      Share if you liked it!
      <div class="blog-post__share-social">
        <SocialIcon social="twitter" />
        <SocialIcon social="linkedin" />
      </div>
    </div>
    <RelatedPosts :current-post="blogPost" :current-author="author" />
  </div>
</template>
<style scoped lang="scss">
.blog-post {
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
        max-width: rem(50px);
      }
    }
  }
  @media screen and (max-width: $breakpoint__mobile--max) {
    &__author-name {
      font-size: rem(20px);
    }
  }
}
</style>
<script>
import PostContent from '~/components/post/PostContent'
import RelatedPosts from '~/components/post/RelatedPosts'
import SocialIcon from '~/components/common/SocialIcon'
import { months } from '~/assets/js/consts'

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
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}
function getMetatags(post, route) {
  const metaTags = [
    {
      name: 'og:title',
      content: post.attributes.title
    },
    {
      name: 'og:image',
      content: `https://www.imagineyourdata.com${
        !post.attributes.social_image
          ? post.attributes.image
          : post.attributes.social_image
      }`
    },
    {
      name: 'og:url',
      content: `https://www.imagineyourdata.com${route.path}`
    },
    {
      name: 'og:site_name',
      content: 'ImagineYourData'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    }
  ]
  if (post.attributes.seo_description) {
    metaTags.push({
      name: 'og:description',
      content: post.attributes.seo_description
    })
  }
  if (post.attributes.seo_keywords) {
    metaTags.push({
      name: 'keywords',
      content: post.attributes.seo_keywords
    })
  }
  return metaTags
}
export default {
  components: { SocialIcon, PostContent, RelatedPosts },
  layout: 'page',
  async asyncData({ route, error }) {
    try {
      const blogPost = await import(`~/content/${route.name}`)
      const postAuthor = await getPostAuthor(blogPost)
      return {
        blogPost: { ...blogPost },
        author: { ...postAuthor },
        date: getDate(blogPost),
        metaTags: getMetatags(blogPost, route)
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Not found' })
    }
  },
  head() {
    return {
      title: this.blogPost.attributes.title,
      meta: [...this.metaTags]
    }
  }
}
</script>
