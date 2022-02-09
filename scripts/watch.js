var path = require('path')
var budo = require('budo')
var slashes = require('connect-slashes')
var build = require('./build')

process.env.NODE_ENV = 'development'

const PORT = 8080

runBuild()

var b = budo('./src/index.js', {
  live: true,
  port: PORT,
  dir: path.join(__dirname, '../dist'),
  watchGlob: ['!dist/**', '**/*.{md,pug,styl,yml,png}'],
  staticOptions: {
    extensions: [ 'html' ]
  }
}).on('connect', e => {
  console.log('Serving site at http://localhost:' + PORT)
}).on('watch', e => {
  runBuild()
  b.reload()
})

function runBuild () {
  try {
    build()
  } catch (err) {
    console.log(err)
  }
}
