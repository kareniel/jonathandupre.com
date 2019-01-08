<template>
  <div>
    <ul class="list">
      <li v-for="post in posts">
        <span>{{ post.date }}</span>
        <nuxt-link :to="'/blog/' + post.slug">
          {{ post.title }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  async asyncData ({ params, payload }) {
    if (process.server) {
      var imported = await import('@/scripts/load')
      var load = imported.default

      payload = load.posts()
    }

    return {
      posts: payload 
    }
  }
}
</script>
