export const state = () => ({
  blogPosts: []
})

export const mutations = {
  setBlogPosts(state, list) {
    state.blogPosts = list
  }
}

export const actions = {
  async nuxtServerInit({ commit }) {
    const files = await require.context('~/content/blog/', false, /\.md$/)
    const blogPosts = files.keys().map((key) => {
      const res = files(key)
      res.slug = key.slice(0, -3)
      return res
    })
    await commit('setBlogPosts', blogPosts)
  }
}
