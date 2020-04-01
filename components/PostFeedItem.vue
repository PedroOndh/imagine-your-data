<template>
  <div class="column is-three-quarters">
    <p class="title is-4">
      <nuxt-link :to="post._path">
        {{ post.attributes.title }}
      </nuxt-link>
    </p>
    <div class="content">
      <p>{{ post.attributes.date }}</p>
      <nuxt-link :to="post._path">
        Read
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostFeedItem',
  props: {
    post: {
      type: Object,
      default() {}
    }
  }
}
</script>

<style scoped>
.column {
  background: #67ab9b;
  color: white;
  padding: 5rem;
  font-size: 1.5rem;
  margin: 1rem;
}
.column a {
  color: white;
  font-weight: bold;
  text-decoration: none;
}
</style>
