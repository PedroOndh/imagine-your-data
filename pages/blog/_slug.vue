<template>
  <div class="blog-post">
    <div class="small-container">
      <h1 class="blog-post__title">
        {{ blogPost.attributes.title }}
      </h1>
      <div class="blog-post__author">
        <img :src="author.attributes.image" :alt="author.attributes.name" />
        <div class="blog-post__author-content">
          <!--
          <span class="blog-post__author-date">{{ date }}</span>
          -->
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
      <client-only>
        <PostContent :content="blogPost.html" />
      </client-only>
    </div>
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
<style lang="scss">
.blog-post {
  &__title {
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
  @media screen and (max-width: $breakpoint__mobile--max) {
    &__author-name {
      font-size: rem(22px);
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
function getMetatags(post) {
  const metaTags = []
  if (post.attributes.seo_description) {
    metaTags.push({
      name: 'description',
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
      const blogPost = await import(`~/content/blog/${route.name}.md`)
      const postAuthor = await getPostAuthor(blogPost)
      const metaTags = getMetatags(blogPost)
      return {
        blogPost: { ...blogPost },
        author: { ...postAuthor },
        date: getDate(blogPost),
        metaTags
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
