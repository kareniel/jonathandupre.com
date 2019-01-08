<template>
  <article>
    <h2>{{ post.data.title }} </h2>
    <div v-html="post.content"></div>
  </article>
</template>

<script>
export default {
  async asyncData ({ params, payload }) {
    if (process.server) {
      var imported = await import('@/scripts/load')
      var load = imported.default

      payload = load.post(params.slug + '.md')
    }

    return {
      post: payload 
    }
  }
}

</script>
