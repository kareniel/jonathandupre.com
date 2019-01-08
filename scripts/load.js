var fs = require('fs')
var path = require('path')
var marked = require('marked')
var matter = require('gray-matter')

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export default {
  post (filename) {
    var contentDir = path.join(path.resolve(), '/content/blog')
    var filepath = path.join(contentDir, filename)

    var file = matter(fs.readFileSync(filepath, 'utf8'))

    return {
      data: file.data,
      content: marked(file.content)
    }
  },

  posts () {
    var contentDir = path.join(path.resolve(), '/content/blog')
    var filenames = fs.readdirSync(contentDir)

    var files = filenames.map(filename => {
      var file = fs.readFileSync(path.join(contentDir, filename))

      file = matter(file)

      return {
        slug: path.basename(filename, '.md'),
        title: file.data.title,
        date: formatDate(file.data.date)
      }
    })

    return files
  }
}

function formatDate (value) {
  var d = new Date(value)

  return `${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`
}
