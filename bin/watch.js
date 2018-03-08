var budo = require('budo')
var sitedown = require('sitedown')
var noop = function () {}

var watcher

render(function () {
  watcher = budo('./noop.js', {
    port: 1111,
    live: true,
    dir: 'build',
    watchGlob: ['!(build)/**/*', '**/*.{md,html}']
  })

  watcher.on('watch', () => render(noop))

  console.log('\nready on http port 1111')
})

function render (done) {
  sitedown({ layout: 'layout.html' }, function (err) {
    if (err) return console.error(err)
    if (watcher) watcher.reload()

    done()
  })
}
