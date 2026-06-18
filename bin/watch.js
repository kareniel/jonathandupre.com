const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const pagesDir = path.join(projectRoot, 'pages');
const contentDir = path.join(projectRoot, 'content');
const includesDir = path.join(projectRoot, 'includes');

let buildTimeout = null;
let isBuilding = false;
let currentBuildProcess = null;
let initialBuildProcess = null;

// Debounced build function
function triggerBuild() {
  if (buildTimeout) {
    clearTimeout(buildTimeout);
  }

  buildTimeout = setTimeout(() => {
    if (isBuilding) {
      return;
    }

    isBuilding = true;
    console.log('\n🔄 Changes detected, rebuilding...\n');

    const buildProcess = spawn('node', [path.join(__dirname, 'build.js')], {
      stdio: 'inherit',
      cwd: projectRoot,
    });

    currentBuildProcess = buildProcess;

    buildProcess.on('close', (code) => {
      isBuilding = false;
      currentBuildProcess = null;
      if (code === 0) {
        console.log('\n✅ Build complete!\n');
      } else {
        console.log(`\n❌ Build failed with code ${code}\n`);
      }
    });
  }, 300); // Debounce for 300ms
}

// Watch function for a directory
function watchDirectory(dir, label) {
  if (!fs.existsSync(dir)) {
    console.warn(`Warning: ${label} directory not found: ${dir}`);
    return;
  }

  console.log(`👀 Watching ${label}: ${dir}`);

  fs.watch(dir, { recursive: true }, (eventType, filename) => {
    if (filename) {
      console.log(`📝 ${eventType}: ${path.join(dir, filename)}`);
      triggerBuild();
    }
  });
}

// Initial build
console.log('🚀 Starting initial build...\n');
initialBuildProcess = spawn('node', [path.join(__dirname, 'build.js')], {
  stdio: 'inherit',
  cwd: projectRoot,
});

initialBuildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Initial build complete!\n');
    console.log('👀 Watching for changes...\n');
    
    // Start watching
    watchDirectory(pagesDir, 'pages');
    watchDirectory(contentDir, 'content');
    watchDirectory(includesDir, 'includes');
  } else {
    console.log(`\n❌ Initial build failed with code ${code}\n`);
    process.exit(1);
  }
});

// Handle process termination
function shutdown() {
  console.log('\n\n👋 Stopping watch...\n');
  
  // Clear any pending build timeout
  if (buildTimeout) {
    clearTimeout(buildTimeout);
    buildTimeout = null;
  }
  
  // Kill current build process if running
  if (currentBuildProcess && !currentBuildProcess.killed) {
    currentBuildProcess.kill('SIGTERM');
  }
  
  // Kill initial build process if still running
  if (initialBuildProcess && !initialBuildProcess.killed) {
    initialBuildProcess.kill('SIGTERM');
  }
  
  // Give processes a moment to clean up, then force exit
  setTimeout(() => {
    process.exit(0);
  }, 100);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
