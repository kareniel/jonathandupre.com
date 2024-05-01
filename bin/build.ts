import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import mkdirp from 'mkdirp';
import pug from 'pug';
import rimraf from 'rimraf';
import matter from 'gray-matter';
import * as marked from 'marked';
import stylus from 'stylus';
import { Feed } from 'feed';
import * as dotenv from 'dotenv';
import { exit } from 'process';
import SITE_DATA from './data'  
import { execSync } from 'child_process';

dotenv.config();

const DirectoryMap = generateDirectoryMap(['dist', 'pages', 'style', 'static', 'src']);
const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default build;

if (require.main === module) {
  build();
  exit();
}

function buildTS () {
  console.log('Building TS...')

  try {
    execSync(`tsc --module es6 --outDir ${path.join(__dirname, '..')}/dist/js/xor src/xor/**/*.ts`, { encoding: 'utf-8' })
  } catch (failed) {
    console.log((failed as any)?.stdout as string)
    process.exit(1)
  }

  console.log('Done building TS.')
}

function build() {
  console.log('Building...');

  const feed = createRSSFeed()
  const renderer = new marked.Renderer();
  const pages = listFilesRecursive(DirectoryMap.pages)
  const siteData = Object.assign({}, SITE_DATA)

  recreateDist();
  copyAssets();
  buildCSS();
  generateDynamicPages(pages, siteData, renderer, feed)
  generateStaticPages(pages, siteData)

  fs.writeFileSync('dist/rss', feed.rss2());
  fs.writeFileSync('dist/atom', feed.atom1());

  buildTS();

  console.log('Done.');
}

function createRSSFeed() {
  const feed = new Feed({
    title: 'Jonathan Dupré',
    description: 'Cybersecurity expert.',
    id: 'https://jonathandupre.com/',
    link: 'https://jonathandupre.com/',
    language: 'en',
    // image: "https://jonathandupre.com/images/logo/logomark-dark-572.png",
    favicon: 'https://jonathandupre.com/favicon.ico',
    copyright: '© 2012-2024, Jonathan Dupré.',
    generator: 'None',
    feedLinks: {
      atom: 'https://jonathandupre.com/atom',
      rss: 'https://jonathandupre.com/rss',
    },
    author: {
      name: 'Jonathan Dupré',
      link: 'https://jonathandupre.com',
    },
  });

  return feed;
}

function compilePug(filename, file, locals) {
  const opts = {
    basedir: path.join(__dirname, '..'),
  };

  return pug.compile(file, { ...opts, filename })(locals);
}

function generatePage(src: string, dest?: string, locals = {}) {
  const file = fs.readFileSync(src, 'utf8');
  const html = compilePug(src, file, locals);

  if (!dest) {
    dest = getDestination(src);
  }

  mkdirp.sync(path.dirname(dest));
  fs.writeFileSync(dest, html);
}

function pageIsDynamic(filename: string) {
  return path.basename(filename, '.pug')[0] === '_'
}

function generateStaticPages(filenames: string[], siteData: Record<string, any>) {
  filenames
    .filter(filename => !pageIsDynamic(filename))
    .forEach((page) => generatePage(page, "", siteData));
}


function generateImageRenderingFn(renderer) {
  return function (href, title, text) {
    href = `${process.env.ASSET_URL || ''}/images/${href}`;

    return renderer.image(renderer, href, title, text);
  };
}

function generateRoute(route, siteData: Record<string, any>, renderer, feed: Feed, ) {
  const fullPath = path.dirname(route)
  const parentDirName = "pages"
  const dirName = fullPath.slice(fullPath.indexOf(parentDirName) + parentDirName.length + 1);
  const contentDir = path.join(__dirname, '..', 'content', dirName);
  const filenames = fs.readdirSync(contentDir);
  const filepaths = filenames.map((filename) => path.join(contentDir, filename));

  if (!siteData.routes[dirName]) {
    siteData.routes[dirName] = [];
  }

  const folder = siteData.routes[dirName];

  filepaths.forEach((filepath) => {
    const str = fs.readFileSync(filepath, 'utf8');
    const dest = getDestination(filepath);
    const frontmatter = matter(str);
    const pageData = frontmatter.data;
    const slug = path.basename(filepath, path.extname(filepath))

    const item = {
      slug: slug,
      title: pageData.title,
      date: formatDate(pageData.date)
    };

    folder.push(item);

    renderer.image = generateImageRenderingFn(renderer);

    const content = marked.marked(frontmatter.content, { renderer });

    if (dirName === 'blog') {
      feed.addItem({
        ...item,
        content,
        date: new Date(item.date),
        link: `https://jonathandupre.com/blog/${slug}`,
      });
    }

    const locals = Object.assign({}, siteData, { 
      post: { 
        data: Object.assign({}, pageData, { 
          year: new Date(item.date).getFullYear(),
          url_path: path.join(dirName, slug),
          slug
        }),
        content 
      }
    })

    generatePage(route, dest, locals);
  });
}

function generateDynamicPages(filenames: string[], siteData: Record<string, any>, renderer, feed: Feed) {
  filenames
    .filter(pageIsDynamic)
    .forEach(route => generateRoute(route, siteData, renderer, feed));
}

function getDestination(src) {
  const d = path.relative(DirectoryMap.root, path.dirname(src));
  const subdir = d.replace('pages', '').replace('content', '');

  const dir = path.join(DirectoryMap.dist, subdir);
  const ext = path.extname(src);
  const filename = `${path.basename(src, ext)}.html`;
  const dest = path.join(dir, filename);

  return dest;
}

function listFilesRecursive(dir: string): Array<string> {
  const filenames = fs.readdirSync(dir);

  const files: (string | string[])[] = filenames.map((filename) => {
    const filepath = path.join(dir, filename);

    return fs.statSync(filepath).isDirectory()
      ? listFilesRecursive(filepath)
      : filepath;
  });

  return flatten(files);
}

function flatten(array): Array<string> {
  return [].concat(...array);
}

function recreateDist() {
  rimraf.sync(DirectoryMap.dist);
  mkdirp.sync(DirectoryMap.dist);
}

function formatDate(value) {
  const d = new Date(value);

  return `${Months[d.getMonth()]} ${String(d.getDate())} ${d.getFullYear()}`;
}

function buildCSS() {
  const styleStr = fs.readFileSync(path.join(DirectoryMap.style, 'style.styl'), 'utf8');

  stylus.render(styleStr, { filename: 'style.css' }, function (err, css) {
    if (err) throw err;

    fs.writeFileSync(path.join(DirectoryMap.dist, 'style.css'), css);
  });
}

function copyAssets() {
  fse.copySync(DirectoryMap.static, DirectoryMap.dist);
}

function generateDirectoryMap(directories): Record<string, string> {
  const rootDir = path.join(__dirname, '..');
  const dir = { root: rootDir };

  directories.forEach((name) => {
    dir[name] = path.join(rootDir, name);
  });

  return dir;
}
