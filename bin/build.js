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

// Collect all reflexions data
function collectReflexions() {
  const contentPath = path.join(contentDir, 'reflexions');
  
  if (!fs.existsSync(contentPath)) {
    return [];
  }

  const markdownFiles = fs.readdirSync(contentPath)
    .filter(file => file.endsWith('.md'));

  const reflexions = markdownFiles.map((mdFile) => {
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
      link: `/reflexions/${slug}`,
      slug,
    };
  });

  // Sort by date (newest first) if date exists
  return reflexions.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    }
    return 0;
  });
}

// Process regular (non-underscore) templates
function processRegularTemplates(templates, reflexions) {
  templates.forEach(({ fullPath, relativePath, name }) => {
    const template = fs.readFileSync(fullPath, 'utf8');
    const html = ejs.render(template, { reflexions }, { filename: fullPath });

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
function processUnderscoreTemplates(templates, reflexions) {
  templates.forEach(({ fullPath, relativePath, dir }) => {
    // For now, only support content/reflexions
    if (dir === 'reflexions') {
      const contentPath = path.join(contentDir, 'reflexions');
      
      if (!fs.existsSync(contentPath)) {
        console.warn(`Content directory not found: ${contentPath}`);
        return;
      }

      // Find all markdown files in content/reflexions
      const markdownFiles = fs.readdirSync(contentPath)
        .filter(file => file.endsWith('.md'));

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
        
        // Render the template with the data
        const html = ejs.render(template, {
          ...frontmatter,
          date: formattedDate,
          content: htmlContent,
          slug,
          link: `/reflexions/${slug}`,
          reflexions,
        }, { filename: fullPath });

        // Output to reflexions/{slug}.html
        const outputPath = path.join(outputDir, 'reflexions', `${slug}.html`);
        
        // Ensure output directory exists
        const outputDirPath = path.dirname(outputPath);
        if (!fs.existsSync(outputDirPath)) {
          fs.mkdirSync(outputDirPath, { recursive: true });
        }

        fs.writeFileSync(outputPath, html, 'utf8');
        console.log(`Compiled ${mdFile} -> reflexions/${slug}.html`);
      });
    }
  });
}

// Main build process
const reflexions = collectReflexions();
const allTemplates = findEjsFiles(pagesDir);
const regularTemplates = allTemplates.filter(t => !t.isUnderscore);
const underscoreTemplates = allTemplates.filter(t => t.isUnderscore);

processRegularTemplates(regularTemplates, reflexions);
processUnderscoreTemplates(underscoreTemplates, reflexions);

console.log('Build complete!');
