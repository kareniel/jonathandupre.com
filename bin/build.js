const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const matter = require('gray-matter');
const { marked } = require('marked');

const projectRoot = path.join(__dirname, '..');
const pagesDir = path.join(projectRoot, 'pages');
const contentDir = path.join(projectRoot, 'content');
const outputDir = path.join(projectRoot, 'build');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

// Recursively find all EJS files
function findEjsFiles(dir, baseDir = dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findEjsFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.ejs')) {
      const relativePath = path.relative(baseDir, fullPath);
      files.push({
        fullPath,
        relativePath,
        name: entry.name,
        isUnderscore: entry.name.startsWith('_'),
        dir: path.dirname(relativePath),
      });
    }
  }

  return files;
}

// Collect all content from a specific content directory
function collectContentFromDir(contentType) {
  const contentPath = path.join(contentDir, contentType);
  
  if (!fs.existsSync(contentPath)) {
    return [];
  }

  const markdownFiles = fs.readdirSync(contentPath)
    .filter(file => file.endsWith('.md'));

  const items = markdownFiles.map((mdFile) => {
    const mdPath = path.join(contentPath, mdFile);
    const mdContent = fs.readFileSync(mdPath, 'utf8');
    const { data: frontmatter } = matter(mdContent);
    
    // Generate slug from title
    const slug = generateSlug(frontmatter.title);
    
    // Format date as YYYY-MM-DD if it exists
    let formattedDate = frontmatter.date;
    if (formattedDate) {
      const date = formattedDate instanceof Date ? formattedDate : new Date(formattedDate);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      }
    }
    
    // Return all metadata plus the link
    return {
      ...frontmatter,
      date: formattedDate,
      link: `/${contentType}/${slug}`,
      slug,
      contentType,
    };
  });

  return items;
}

// Collect all content from all content directories
function collectAllContent() {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const contentTypes = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  const allContent = [];
  
  contentTypes.forEach(contentType => {
    const items = collectContentFromDir(contentType);
    allContent.push(...items);
  });

  // Sort by date (newest first) if date exists
  return allContent.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    }
    return 0;
  });
}

// Collect all reflexions data (for backward compatibility)
function collectReflexions() {
  return collectContentFromDir('reflexions');
}

// Process regular (non-underscore) templates
function processRegularTemplates(templates, allContent) {
  templates.forEach(({ fullPath, relativePath, name }) => {
    const template = fs.readFileSync(fullPath, 'utf8');
    
    // For backward compatibility, provide reflexions as well as allContent
    const reflexions = allContent.filter(item => item.contentType === 'reflexions');
    const html = ejs.render(template, { reflexions, allContent }, { filename: fullPath });

    // Output filename (e.g., index.ejs -> index.html)
    const outputFile = name.replace('.ejs', '.html');
    const outputPath = path.join(outputDir, path.dirname(relativePath), outputFile);

    // Ensure output directory exists
    const outputDirPath = path.dirname(outputPath);
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }

    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`Compiled ${relativePath} -> ${path.relative(outputDir, outputPath)}`);
  });
}

// Process underscore templates with markdown content
function processUnderscoreTemplates(templates, allContent) {
  templates.forEach(({ fullPath, relativePath, dir }) => {
    // Check if there's a matching content directory
    const contentPath = path.join(contentDir, dir);
    
    if (!fs.existsSync(contentPath)) {
      // Silently skip if no matching content directory
      return;
    }

    // Find all markdown files in the content directory
    const markdownFiles = fs.readdirSync(contentPath)
      .filter(file => file.endsWith('.md'));

    if (markdownFiles.length === 0) {
      return;
    }

    // Read the template
    const template = fs.readFileSync(fullPath, 'utf8');

    markdownFiles.forEach((mdFile) => {
      const mdPath = path.join(contentPath, mdFile);
      const mdContent = fs.readFileSync(mdPath, 'utf8');
      
      // Parse frontmatter and content
      const { data: frontmatter, content } = matter(mdContent);
      
      // Generate slug from title
      const slug = generateSlug(frontmatter.title);
      
      // Format date as YYYY-MM-DD if it exists
      let formattedDate = frontmatter.date;
      if (formattedDate) {
        const date = formattedDate instanceof Date ? formattedDate : new Date(formattedDate);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          formattedDate = `${year}-${month}-${day}`;
        }
      }
      
      // Convert markdown to HTML
      const htmlContent = marked(content);
      
      // Get content items for this type (for backward compatibility with reflexions variable)
      const contentTypeItems = allContent.filter(item => item.contentType === dir);
      
      // Render the template with the data
      const html = ejs.render(template, {
        ...frontmatter,
        date: formattedDate,
        content: htmlContent,
        slug,
        link: `/${dir}/${slug}`,
        reflexions: contentTypeItems, // Keep for backward compatibility
        allContent, // Also provide all content
      }, { filename: fullPath });

      // Output to {dir}/{slug}.html
      const outputPath = path.join(outputDir, dir, `${slug}.html`);
      
      // Ensure output directory exists
      const outputDirPath = path.dirname(outputPath);
      if (!fs.existsSync(outputDirPath)) {
        fs.mkdirSync(outputDirPath, { recursive: true });
      }

      fs.writeFileSync(outputPath, html, 'utf8');
      console.log(`Compiled ${mdFile} -> ${dir}/${slug}.html`);
    });
  });
}

// Format date in RFC 3339 format for Atom feeds
function formatRFC3339(dateString) {
  if (!dateString) return new Date().toISOString();
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  if (isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

// Decode HTML entities in content (marked converts apostrophes to &#39;)
// Since we're using CDATA, we want the actual characters, not entities
function decodeHtmlEntities(html) {
  if (typeof html !== 'string') {
    return '';
  }
  return html
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

// Escape XML text content - only escape what's necessary for text nodes
// In XML text content, only &, <, and > need to be escaped
// Apostrophes and quotes don't need escaping in text content (only in attributes)
// UTF-8 characters like é, è, à, etc. should pass through unchanged
function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') {
    return '';
  }
  // Escape & first to avoid double-escaping
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Generate Atom RSS feed
function generateAtomFeed(allContent) {
  const siteUrl = 'https://jonathandupre.com';
  const feedId = `${siteUrl}/atom`;
  const feedTitle = 'Jonathan Dupré';
  const feedSubtitle = 'Réflexions philosophiques sur l\'expérience humaine et la nature de la réalité';
  const authorName = 'Jonathan Dupré';
  
  // Get the most recent update date
  const updatedDate = allContent.length > 0 && allContent[0].date
    ? formatRFC3339(allContent[0].date)
    : new Date().toISOString();

  // Read full content for each item
  const entries = allContent.map((item) => {
    const contentTypePath = path.join(contentDir, item.contentType);
    
    // Find the markdown file for this item
    const markdownFiles = fs.readdirSync(contentTypePath)
      .filter(file => file.endsWith('.md'));
    
    let htmlContent = '';
    let entryDate = updatedDate;
    
    // Find matching markdown file and get content
    for (const mdFile of markdownFiles) {
      const mdPath = path.join(contentTypePath, mdFile);
      const mdContent = fs.readFileSync(mdPath, 'utf8');
      const { data: frontmatter, content } = matter(mdContent);
      const slug = generateSlug(frontmatter.title);
      
      if (slug === item.slug) {
        htmlContent = marked(content);
        // Decode HTML entities since we're using CDATA (marked converts apostrophes to &#39;)
        htmlContent = decodeHtmlEntities(htmlContent);
        if (item.date) {
          entryDate = formatRFC3339(item.date);
        }
        break;
      }
    }

    const entryId = `${siteUrl}${item.link}`;
    const entryLink = `${siteUrl}${item.link}`;
    const entryTitle = escapeXml(item.title || 'Untitled');
    const entrySummary = item.description ? escapeXml(item.description) : '';
    
    return {
      id: entryId,
      title: entryTitle,
      link: entryLink,
      updated: entryDate,
      summary: entrySummary,
      content: htmlContent,
    };
  });

  // Build Atom XML
  let atomXml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(feedTitle)}</title>
  <subtitle>${escapeXml(feedSubtitle)}</subtitle>
  <link href="${siteUrl}" rel="alternate" type="text/html"/>
  <link href="${feedId}" rel="self" type="application/atom+xml"/>
  <id>${feedId}</id>
  <updated>${updatedDate}</updated>
  <author>
    <name>${escapeXml(authorName)}</name>
  </author>
`;

  entries.forEach((entry) => {
    atomXml += `  <entry>
    <id>${entry.id}</id>
    <title>${entry.title}</title>
    <link href="${entry.link}" rel="alternate" type="text/html"/>
    <updated>${entry.updated}</updated>
`;
    
    if (entry.summary) {
      atomXml += `    <summary type="text">${entry.summary}</summary>
`;
    }
    
    if (entry.content) {
      // Use CDATA for HTML content to avoid escaping issues
      const cdataContent = entry.content.replace(/]]>/g, ']]&gt;');
      atomXml += `    <content type="html"><![CDATA[${cdataContent}]]></content>
`;
    }
    
    atomXml += `  </entry>
`;
  });

  atomXml += `</feed>`;

  // Write feed to build directory with explicit UTF-8 encoding
  const feedPath = path.join(outputDir, 'atom');
  // Ensure UTF-8 encoding by using Buffer
  const buffer = Buffer.from(atomXml, 'utf8');
  fs.writeFileSync(feedPath, buffer);
  console.log(`Generated Atom feed -> atom`);
}

function copyPublicDirectory() {
  const publicDir = path.join(projectRoot, 'public');

  if (!fs.existsSync(publicDir)) {
    return;
  }

  function copyRecursive(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${path.relative(projectRoot, srcPath)} -> ${path.relative(projectRoot, destPath)}`);
      }
    }
  }

  copyRecursive(publicDir, outputDir);
}

// Main build process
const allContent = collectAllContent();
const allTemplates = findEjsFiles(pagesDir);
const regularTemplates = allTemplates.filter(t => !t.isUnderscore);
const underscoreTemplates = allTemplates.filter(t => t.isUnderscore);

processRegularTemplates(regularTemplates, allContent);
processUnderscoreTemplates(underscoreTemplates, allContent);
generateAtomFeed(allContent);
copyPublicDirectory();

console.log('Build complete!');
