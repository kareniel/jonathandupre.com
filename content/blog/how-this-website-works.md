---
title: How this website works
date: 2022-02-11
description: This post explains how the jonathandupre.com website works.
---

This post explains how this website (jonathandupre.com) works. You can use it as an example when you need to describe one of your own systems.

I bought jonathandupre.com in 2012, but the current iteration started in January 2019.

```
$ whois jonathandupre.com | grep "Creation Date"
Creation Date: 2012-05-24T02:26:50Z
```

Blog posts are written in Markdown, with YAML front matter.

I wrote two javascript scripts. A watch script and a build script.

The build script is mostly made up of a bunch of parsers: markdown, pug (html), and stylus (css). It recursively reads templates and content directories. It then builds HTML pages, a CSS file, and RSS/Atom feeds. It also copies over static assets like images and text files.

The watch script is just a wrapper around budo, a Node.js dev server. budo watches the filesystem and calls the build script when something changes.

There are two javascript files. 

One is the Fathom Analytics bundle. It counts visitors and views in a way that preserves privacy. I pay US$ 14 a month for this service.

The other one is from ConvertKit and it makes the email list subscription box work. I pay US$ 9 a month for this service.

I use Tachyons as a CSS framework. It helps me have a standard visual style and avoid writing boilerplate classes. 

The code is hosted on GitHub. I use two branch, the main branch and a development branch.

Netlify hosts the website. They integrate with GitHub. Everytime I merge my changes into the main branch, Netlify runs my build script and deploys the new assets so that they can be served by their web servers.

The DNS records are hosted for free with a reputable registrar. There's a CNAME at `www.` that points to the A record, which points to Netlify's load balancers.

The domain name costs me around CA$ 15 a year. That brings the total to about CA$ 30 a month, or CA$ 360 a year.

The website takes under 2 seconds to build.
Updates are live under 2 minutes.

And that's about it! I hope this gave you a good example of how you can describe one of your systems. 
