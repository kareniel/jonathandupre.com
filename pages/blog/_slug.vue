<template>
  <div>
    THIS IS A BLOG POST YESSS 
    <pre>content: {{ content }}</pre>
  </div>
</template>

<script>
export default {
  async asyncData ({ params, payload }) {
    if (process.server) {
      return import('@/scripts/load-content').then(loadContent => {
        payload = loadContent.default('blog', params.slug + '.md')
        return { content: payload }
      })
    }

    return { 
      content: payload 
    }
  }
}

</script>
