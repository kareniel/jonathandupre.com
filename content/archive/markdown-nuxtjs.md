---
title: Generating a fully static website using Nuxt.js and markdown
date: 2019-01-07
---

> Warning: This solution assumes that you'll strip off the Vue SPA completely from your site in production. 

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
  return {
    route: `/blog/${path.basename(filename, '.md')}`,
    payload: fs.readFileSync(path.join(contentDir, filename))
  }
});

```

Now, running `nuxt generate` will create an .html file for each blog post.

This is not the ideal approach though. You might have noticed that this solution
implies doing all this I/O and then keeping all those files in memory while
we're running the development server, which is wasteful.

Luckily, the `routes` key also takes a function returning an array.
That function will only be called when we use `generate`.

```js
var routes = function () {
  return contentFiles.map(filename => {
    return {
      route: `/blog/${path.basename(filename, '.md')}`,
      payload: fs.readFileSync(path.join(contentDir, filename))
    }
  }
};
```
We can then grab the file's content through a special method that Nuxt adds to
Vue components called `asyncData`. This function is called every time a route
is rendered, both on the client and the server. You can use it to return an
object asynchronously, and that object will be merged with the component's 
$data.

```html
<script>
export default {
  async asyncData (context) {
    return { 
      post: context.payload 
    }
  }
}
</script>
```

In the above example, `post` would then be accessible to the component through 
`this.data.post`. You can then render it in your template.

```html
<template>
  <div>
    {{ post }}
  </div>
</template>
```

But since we're rendering the file as is, we get markdown in our page, which is 
not the desired result! We could use a component library for this, like 
`vue-markdown`, but then we would lose the benefits of rendering our pages 
statically. 

`npm install --save marked` 

```js
var file = fs.readFileSync(path.join(contentDir, filename))

return {
  route: `/blog/${path.basename(filename, '.md')}`,
  payload: marked(file)
}
```

```html
<template>
  <div v-html="post"></div>
</template>
```

Be careful here!

You're both parsing AND rendering raw html in a web application. 
Make sure you have full control over the markdown files that go through these steps, or you could end up with serious security problems.


We still have one issue to address.
We want to make sure all of this works even in development mode.
That is, when you run the `nuxt` command.

Nuxt uses [Connect](https://github.com/senchalabs/connect) under the hood to 
serve your website while you are working on it. That means that the changes we 
made to the config file under the `generate` key don't apply. The development 
server does not know about our whole file loading thing.

The solution I have found for this is to add a check to see if we're on the 
server inside our asyncData function, and if so, import our file loading 
function.

```js
export default {
  async asyncData ({ params, payload }) {
    if (process.server) {
      var loadContent = await import('@/scripts/load-content')

      payload = loadContent.default('blog', params.slug + '.md')
    }

    return { 
      post: payload 
    }
  }
}

```

This solution, however, will break the client-side code. 
Since we don't have access to the `fs` module in the browser, webpack and 
babel won't let us compile this. There's a few workarounds, but the one I 
find the most elegant is the `browser` field in package.json. 

This field will let you tell webpack and babel what package you want it to load 
when it's parsing code in the context of the browser. You can also pass it false 
and it will simply not try to load anything.

```json
{
  "browser": {
    "fs": false
  }
}
```

And with this, we're all set.
Running `nuxt`, we have routes for all of our blog posts, with html generated 
from markdown files. And running `nuxt generate`, we get a static file for all 
of those routes, ready to be served.

I hope this was useful to you!

Let me know if you have any questions, or if you found a more elegant solution 
to this problem. Thank you for reading!


