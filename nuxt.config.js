export default {
  globalName: 'website',
  head: {
    title: 'Jonathan Dupré',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [{
      rel: 'stylesheet',
      href: 'https://unpkg.com/tachyons@4.10.0/css/tachyons.min.css'
    }]
  },
  render: {
    resourceHints: false
  },
  modules: [
    ['@nuxtjs/google-analytics', {
      id: 'UA-73566907-1'
    }]
  ]
}
