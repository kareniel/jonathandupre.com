const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { URL } = require('url');

const projectRoot = path.join(__dirname, '..');
const buildDir = path.join(projectRoot, 'build');
const publicDir = path.join(projectRoot, 'public');

const PORT = process.env.PORT || 3000;

// Start watch process
console.log('🚀 Starting watch process...\n');
const watchProcess = spawn('node', [path.join(__dirname, 'watch.js')], {
  stdio: 'inherit',
  cwd: projectRoot,
});

watchProcess.on('error', (err) => {
  console.error('❌ Failed to start watch process:', err);
  process.exit(1);
});

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const filePath = findFile(url.pathname);

  if (filePath) {
    serveFile(filePath, res);
  } else {
    // Serve 404 page
    const notFoundPath = path.join(buildDir, '404.html');
    if (fs.existsSync(notFoundPath)) {
      serveFile(notFoundPath, res);
    } else {
      // Fallback if 404.html doesn't exist
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>404 Not Found</title>
            <style>
              body { font-family: sans-serif; text-align: center; padding: 50px; }
              h1 { color: #333; }
            </style>
          </head>
          <body>
            <h1>404 Not Found</h1>
            <p>The requested resource was not found.</p>
          </body>
        </html>
      `);
    }
  }
});

server.listen(PORT, () => {
  console.log(`\n🌐 Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving from: ${buildDir}`);
  console.log(`📁 Static assets from: ${publicDir}`);
  console.log(`\nPress Ctrl+C to stop\n`);
});

// Handle graceful shutdown
function shutdown() {
  console.log('\n\n👋 Shutting down...\n');
  
  // Kill watch process
  if (watchProcess && !watchProcess.killed) {
    watchProcess.kill('SIGINT');
  }
  
  // Close server
  server.close(() => {
    // Give processes a moment to clean up
    setTimeout(() => {
      process.exit(0);
    }, 200);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function getMimeType(filePath) {
  // Handle atom feed file (no extension)
  const fileName = path.basename(filePath);
  if (fileName === 'atom') {
    return 'application/atom+xml; charset=utf-8';
  }
  
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Serve 404 page on file read error
      const notFoundPath = path.join(buildDir, '404.html');
      if (fs.existsSync(notFoundPath)) {
        fs.readFile(notFoundPath, (notFoundErr, notFoundData) => {
          if (notFoundErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(notFoundData);
          }
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
      return;
    }

    const mimeType = getMimeType(filePath);
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
}

function findFile(urlPath) {
  // Remove leading slash
  const cleanPath = urlPath.replace(/^\/+/, '');

  // Try public directory first (for static assets)
  const publicPath = path.join(publicDir, cleanPath);
  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    return publicPath;
  }

  // Try build directory
  let buildPath = path.join(buildDir, cleanPath);
  
  // If it's a directory, try index.html
  if (fs.existsSync(buildPath) && fs.statSync(buildPath).isDirectory()) {
    buildPath = path.join(buildPath, 'index.html');
  }
  
  // If no extension, try .html
  if (!path.extname(buildPath)) {
    const htmlPath = `${buildPath}.html`;
    if (fs.existsSync(htmlPath)) {
      return htmlPath;
    }
  }

  // Check if the file exists
  if (fs.existsSync(buildPath) && fs.statSync(buildPath).isFile()) {
    return buildPath;
  }

  // Try index.html in build root for root path
  if (cleanPath === '' || cleanPath === '/') {
    const indexPath = path.join(buildDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
  }

  return null;
}
