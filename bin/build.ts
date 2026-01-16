import { Eta } from 'eta';
import * as fs from 'fs-extra';
import * as path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';
import stylus from 'stylus';
import { Feed } from 'feed';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');

// Configure Eta
const eta = new Eta({
  views: rootDir,
  cache: false,
});

// Navbar configuration
const navbar = {
  items: [
    { name: 'Home', route: '/' },
    { name: 'About', route: '/about' },
    { name: 'Blog', route: '/blog' },
    { name: 'Contact', route: '/contact' },
  ],
};

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  data: any;
  content: string;
  rawContent: string;
}

async function loadBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];
  const blogDir = path.join(rootDir, 'content', 'blog');
  const archiveDir = path.join(rootDir, 'content', 'archive');

  // Load posts from blog directory
  if (await fs.pathExists(blogDir)) {
    const blogFiles = await fs.readdir(blogDir);
    for (const file of blogFiles) {
      if (file.endsWith('.md')) {
        const filePath = path.join(blogDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const { data, content: markdown } = matter(content);
        const slug = path.basename(file, '.md');
        const html = marked(markdown);
        
        posts.push({
          slug,
          title: data.title || slug,
          date: data.date || new Date().toISOString().split('T')[0],
          description: data.description,
          data,
          content: html,
          rawContent: markdown,
        });
      }
    }
  }

  // Load posts from archive directory (recursively)
  if (await fs.pathExists(archiveDir)) {
    const archiveFiles = await getAllMarkdownFiles(archiveDir);
    for (const filePath of archiveFiles) {
      const content = await fs.readFile(filePath, 'utf-8');
      const { data, content: markdown } = matter(content);
      const relativePath = path.relative(archiveDir, filePath);
      const slug = relativePath.replace(/\.md$/, '').replace(/\//g, '-');
      const html = marked(markdown);
      
      posts.push({
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString().split('T')[0],
        description: data.description,
        data,
        content: html,
        rawContent: markdown,
      });
    }
  }

  return posts;
}

async function getAllMarkdownFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subFiles = await getAllMarkdownFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function buildPages(posts: BlogPost[]): Promise<void> {
  const routes = {
    blog: posts.map(post => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      description: post.description,
    })),
  };

  const baseData = {
    navbar,
    routes,
  };

  // Build index page
  const indexHtml = eta.render('./pages/index.eta', baseData);
  await fs.writeFile(path.join(buildDir, 'index.html'), indexHtml);

  // Build about page
  const aboutHtml = eta.render('./pages/about.eta', baseData);
  await fs.ensureDir(path.join(buildDir, 'about'));
  await fs.writeFile(path.join(buildDir, 'about', 'index.html'), aboutHtml);

  // Build contact page
  const contactHtml = eta.render('./pages/contact.eta', baseData);
  await fs.ensureDir(path.join(buildDir, 'contact'));
  await fs.writeFile(path.join(buildDir, 'contact', 'index.html'), contactHtml);

  // Build 404 page
  const notFoundHtml = eta.render('./pages/404.eta', baseData);
  await fs.writeFile(path.join(buildDir, '404.html'), notFoundHtml);

  // Build blog index page
  const blogIndexHtml = eta.render('./pages/blog/index.eta', baseData);
  await fs.ensureDir(path.join(buildDir, 'blog'));
  await fs.writeFile(path.join(buildDir, 'blog', 'index.html'), blogIndexHtml);

  // Build individual blog posts
  for (const post of posts) {
    const postData = {
      ...baseData,
      post: {
        data: post.data,
        content: post.content,
      },
    };
    const postHtml = eta.render('./pages/blog/_slug.eta', postData);
    await fs.ensureDir(path.join(buildDir, 'blog', post.slug));
    await fs.writeFile(path.join(buildDir, 'blog', post.slug, 'index.html'), postHtml);
  }
}

async function buildCSS(): Promise<void> {
  const stylusFile = path.join(rootDir, 'style', 'style.styl');
  const stylusContent = await fs.readFile(stylusFile, 'utf-8');
  
  const css = await new Promise<string>((resolve, reject) => {
    stylus(stylusContent)
      .set('paths', [path.join(rootDir, 'style')])
      .render((err, css) => {
        if (err) reject(err);
        else resolve(css);
      });
  });

  await fs.ensureDir(path.join(buildDir, 'style'));
  await fs.writeFile(path.join(buildDir, 'style.css'), css);
}

async function copyStaticAssets(): Promise<void> {
  const staticDir = path.join(rootDir, 'static');
  if (await fs.pathExists(staticDir)) {
    await fs.copy(staticDir, buildDir);
  }
}

async function copyConfigFiles(): Promise<void> {
  // Copy _redirects
  const redirectsPath = path.join(rootDir, '_redirects');
  if (await fs.pathExists(redirectsPath)) {
    await fs.copy(redirectsPath, path.join(buildDir, '_redirects'));
  }

  // Copy _headers
  const headersPath = path.join(rootDir, '_headers');
  if (await fs.pathExists(headersPath)) {
    await fs.copy(headersPath, path.join(buildDir, '_headers'));
  }
}

async function buildFeeds(posts: BlogPost[]): Promise<void> {
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const feed = new Feed({
    title: 'Jonathan Dupré',
    description: 'Cybersecurity expert',
    id: 'https://jonathandupre.com/',
    link: 'https://jonathandupre.com/',
    language: 'en',
    copyright: `© ${new Date().getFullYear()} Jonathan Dupré`,
    author: {
      name: 'Jonathan Dupré',
      email: 'hello@jonathandupre.com',
    },
  });

  // Add posts to feed (limit to most recent 20)
  for (const post of sortedPosts.slice(0, 20)) {
    feed.addItem({
      title: post.title,
      id: `https://jonathandupre.com/blog/${post.slug}`,
      link: `https://jonathandupre.com/blog/${post.slug}`,
      description: post.description || '',
      content: post.content,
      date: new Date(post.date),
    });
  }

  // Generate RSS
  const rss = feed.rss2();
  await fs.writeFile(path.join(buildDir, 'rss'), rss);

  // Generate Atom
  const atom = feed.atom1();
  await fs.writeFile(path.join(buildDir, 'atom'), atom);
}

async function main(): Promise<void> {
  console.log('Starting build...');

  // Clean build directory
  if (await fs.pathExists(buildDir)) {
    await fs.remove(buildDir);
  }
  await fs.ensureDir(buildDir);

  // Load blog posts
  console.log('Loading blog posts...');
  const posts = await loadBlogPosts();
  console.log(`Found ${posts.length} blog posts`);

  // Build pages
  console.log('Building pages...');
  await buildPages(posts);

  // Build CSS
  console.log('Building CSS...');
  await buildCSS();

  // Copy static assets
  console.log('Copying static assets...');
  await copyStaticAssets();

  // Copy config files
  console.log('Copying config files...');
  await copyConfigFiles();

  // Build feeds
  console.log('Building feeds...');
  await buildFeeds(posts);

  console.log('Build complete!');
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});

