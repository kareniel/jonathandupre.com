---
title: Using markdown in Nuxt.js static website
---

So, Nuxt.js doesn't come with markdown compilation out of the box.

That's an issue, because the whole reason I chose Nuxt for my personal website
was to generate the blog pages from markdown.

Let's fix it!


First things first, let's see if we can generate pages dynamically.
The way I understand it, when calling `nuxt generate`, Nuxt will create a static
page for every component in the `/page` directory. 

But in our case, our blog posts won't be in that directory.

Nuxt let's you use something called 'Dynamic routes', and this is what we're
gonna use to implement our solution. Dynamic routes let's you generate routes
based on the fly. 

Provided with a route like `/blog/my-blog-post`, Nuxt will look in  
`/pages/blog` for a directory or a .vue file prefixed by an 
underscore.

The name of that directory or file will determine the name of the parameter 
in that dynamic route.

```
/www
  /pages
    /blog
      _slug.vue  <- This will give us `/blog/:slug` routes
      index.vue
```

The caveat is that `nuxt generate` won't automatically create
those routes when it runs. We need to provide it with a list so it knows what
to do.

We do this in the `nuxt.config.js` file:

```js
export default {
  generate: {
    routes: [ 
      '/blog/my-blog-post'
    ]
  }
}

```

But unless you know in advance the title of every blog post you'll ever write,
providing a hard-coded list won't cut it.

Instead, we'll want to generate that list when the website is generated.

Since I'm going to put my blog posts in `/content/blog`, I'll ask Node to give
me a list of all the files in there, and then use that the build the routes 
list.

```js
var fs = require('fs')
var path = require('path')

var contentDir = path.join(__dirname, '/content/blog')
var contentFiles = fs.readdirSync(contentDir)

var routes = contentFiles.map(filename => {
  return `/blog/${path.basename(filename, '.md')}`
})

```

Now, running `nuxt generate` will create an .html file for each blog post.
But there are still two issues to address.

First, we want to read the markdown files and parse them. Second, we want to
have some kind of list of the available blog posts so we can create an index.

So let's address reading and parsing first.

 
