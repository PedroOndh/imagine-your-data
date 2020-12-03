<template>
  <div class="blog-post">
    <article class="small-container">
      <div class="blog-post__edit-button-container">
        <a
          v-if="$nuxt.context.env.dev"
          class="blog-post__edit-button"
          :href="
            `https://dev.imagineyourdata.com/admin/#/collections/blog/entries/${filename}`
          "
        >
          Edit on CMS
        </a>
      </div>
      <h1 class="blog-post__title page-title">
        {{ blogPost.attributes.title }}
      </h1>
      <div v-if="author.attributes" class="blog-post__author">
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
        <SocialIcon
          social="twitter"
          :share="true"
          :post="blogPost"
          :path="path"
        />
        <SocialIcon
          social="linkedin"
          :share="true"
          :post="blogPost"
          :path="path"
        />
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
      font-size: $font-size--regular-big;
      color: #747474;
    }
  }
  &__edit-button {
    background: $corporative-blue;
    border: none;
    border-radius: 1.25rem;
    padding: 0.5rem 1rem;
    margin: 0.2rem;
    text-transform: uppercase;
    font-size: 1rem;
    font-weight: $font-weight--semibold;
    color: white;
    &-container {
      display: flex;
      justify-content: flex-end;
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
      font-size: $font-size--small;
    }
  }
}
</style>
<script>
import PostContent from '~/components/post/PostContent'
import RelatedPosts from '~/components/post/RelatedPosts'
import SocialIcon from '~/components/common/SocialIcon'
import { months } from '~/assets/js/config'

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
function getMetatags(post, author, route) {
  const image = !post.attributes.social_image
    ? post.attributes.image
    : post.attributes.social_image
  const metaTags = [
    {
      name: 'title',
      property: 'og:title',
      content: post.attributes.title
    },
    {
      name: 'twitter:title',
      content: post.attributes.title
    },
    {
      property: 'og:type',
      content: 'article'
    },
    {
      name: 'image',
      property: 'og:image',
      content: `https://www.imagineyourdata.com${image}`
    },
    {
      name: 'twitter:image',
      content: `https://www.imagineyourdata.com${image}`
    },
    {
      name: 'author',
      content: author.attributes.name
    },
    {
      property: 'og:url',
      content: `https://www.imagineyourdata.com${route.path}`
    },
    {
      property: 'og:site_name',
      content: 'ImagineYourData'
    },
    {
      property: 'twitter:card',
      content: 'summary_large_image'
    }
  ]
  if (post.attributes.seo_description) {
    metaTags.push({
      name: 'description',
      property: 'og:description',
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
        filename: route.name.slice(5, -3),
        blogPost: { ...blogPost },
        author: { ...postAuthor },
        date: getDate(blogPost),
        metaTags: getMetatags(blogPost, postAuthor, route),
        path: route.path
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
