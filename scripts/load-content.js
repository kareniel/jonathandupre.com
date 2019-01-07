var fs = require('fs')
var path = require('path')

export default function (type, filename) {
  var contentDir = path.join(path.resolve(), '/content', type)
  var filepath = path.join(contentDir, filename)

  var file = fs.readFileSync(filepath, 'utf8')

  return file
}
