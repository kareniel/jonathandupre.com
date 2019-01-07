<template lang="pug">
  .__layout-parent.sans-serif.flex.flex-column
    Navbar
    Content
    Footer
</template>

<style lang="stylus">
@import '../style/style.styl'
.__layout-parent 
  min-height: 100vh
</style>

<script>
import Navbar from '@/components/Navbar.vue'
import Content from '@/components/Content.vue'
import Footer from '@/components/Footer.vue'

export default {
  components: {
    Navbar,
    Content,
    Footer
  }
}
</script>
