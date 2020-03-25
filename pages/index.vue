<template>
  <div class="container">
    <h1 class="title">
      Imagine your data
    </h1>
    <section class="posts">
      <!-- eslint-disable-next-line -->
      <div v-for="post in blogPosts" :key="post.attributes.title" class="columns">
        <div class="column is-three-quarters">
          <p class="title is-4">
            <nuxt-link :to="post.slug">
              {{ post.attributes.title }}
            </nuxt-link>
          </p>
          <div class="content">
            <p>{{ post.attributes.date }}</p>
            <nuxt-link :to="post.slug">
              Read
            </nuxt-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  computed: {
    blogPosts() {
      return this.$store.state.blogPosts
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
