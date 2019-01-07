<template lang="pug">
  nav.flex.justify-center.pv2.bg-black-90.white
    .container.flex.justify-between.pv1
      nuxt-link.link.white.f3.fw6(to="/") Jonathan Dupré
      ul.list.flex.items-center.ma0.tr
        li.ml4(v-for="item in items") 
          nuxt-link.white.link(:to="item.route" active-class="light-blue") 
            | {{ item.name }}
</template>

<script>
export default {
  data () {
    return {
      items: [
        { name: 'Blog', route: '/blog' }, 
        { name: 'About', route: '/about' }, 
        { name: 'Hire me', route: '/hire-me' },
        { name: 'Contact', route: '/contact'} 
      ]
    }
  }
}

</script>
