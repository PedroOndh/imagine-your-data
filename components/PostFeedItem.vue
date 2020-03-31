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
  props: ['post']
}
</script>

<style scoped>
.column {
  border: 1px solid red;
  padding: 5rem;
  margin: 1rem;
}
</style>
