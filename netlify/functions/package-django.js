// Update the Django deployment strategy to copy files to a flatter structure
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  yellow: '\x1b[33m'
};

// Log with timestamp and color
function log(message, color = colors.reset) {
  const timestamp = new Date().toISOString();
  console.log(`${colors.bright}${timestamp}${colors.reset} ${color}${message}${colors.reset}`);
}

// Copy directory recursively with specific exclusions
async function copyDir(src, dest, excludePatterns = []) {
  try {
    await fs.ensureDir(dest);
    
    const entries = await fs.readdir(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      // Check if path should be excluded
      const shouldExclude = excludePatterns.some(pattern => {
        if (typeof pattern === 'string') {
          return srcPath.includes(pattern);
        } else if (pattern instanceof RegExp) {
          return pattern.test(srcPath);
        }
        return false;
      });
      
      if (shouldExclude) {
        log(`Skipping excluded path: ${srcPath}`, colors.yellow);
        continue;
      }
      
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath, excludePatterns);
      } else {
        await fs.copy(srcPath, destPath);
      }
    }
    
    return true;
  } catch (err) {
    log(`Error copying directory from ${src} to ${dest}: ${err}`, colors.red);
    return false;
  }
}

// Create a flattened Django structure for Lambda
async function createLambdaLayout() {
  try {
    const tmpDir = path.join(__dirname, 'django-tmp');
    log(`Creating temporary directory for Django packaging: ${tmpDir}`, colors.green);
    
    // Clean up any existing tmp directory
    if (await fs.pathExists(tmpDir)) {
      log('Removing existing temporary directory', colors.yellow);
      await fs.remove(tmpDir);
    }
    
    // Create tmp directory
    await fs.ensureDir(tmpDir);
    
    // Copy key directories and files to tmp directory
    const rootDir = path.resolve(__dirname, '../..');
    
    // Copy our special WSGI adapters first
    log('Copying WSGI adapter files', colors.green);
    await fs.copy(path.join(__dirname, 'wsgi.py'), path.join(tmpDir, 'wsgi.py'));
    await fs.copy(path.join(__dirname, 'wsgi_adapter.py'), path.join(tmpDir, 'wsgi_adapter.py'));
    
    // Copy important directories
    const dirsToInclude = [
      { src: path.join(rootDir, 'config'), dest: path.join(tmpDir, 'config') },
      { src: path.join(rootDir, 'apps'), dest: path.join(tmpDir, 'apps') },
      { src: path.join(rootDir, 'templates'), dest: path.join(tmpDir, 'templates') },
      { src: path.join(rootDir, 'staticfiles'), dest: path.join(tmpDir, 'staticfiles') },
    ];
    
    // Add optional directories if they exist
    if (await fs.pathExists(path.join(rootDir, 'templatetags'))) {
      dirsToInclude.push({ 
        src: path.join(rootDir, 'templatetags'), 
        dest: path.join(tmpDir, 'templatetags') 
      });
    }
    
    // Process each directory
    for (const { src, dest } of dirsToInclude) {
      if (await fs.pathExists(src)) {
        log(`Copying ${src} to ${dest}`, colors.green);
        await copyDir(src, dest, [
          '__pycache__',
          '.pyc',
          '.git',
          'node_modules',
          'tests',
          'fixtures'
        ]);
      } else {
        log(`Warning: Directory not found ${src}`, colors.yellow);
      }
    }
    
    // Create a Django directory structure for alternative import paths
    const djangoDir = path.join(tmpDir, 'django');
    await fs.ensureDir(djangoDir);
    
    // Copy config and wsgi.py to django directory for alternative import path
    log('Creating django subdirectory with config for alternative import paths', colors.green);
    await copyDir(path.join(tmpDir, 'config'), path.join(djangoDir, 'config'), [
      '__pycache__',
      '.pyc'
    ]);
    
    // Create a special wsgi.py file at the root with direct code
    await fs.copy(path.join(__dirname, 'wsgi.py'), path.join(djangoDir, 'wsgi.py'));
    
    // Copy the wsgi file directly
    if (await fs.pathExists(path.join(rootDir, 'config/wsgi.py'))) {
      log('Copying config/wsgi.py directly', colors.green);
      await fs.copy(
        path.join(rootDir, 'config/wsgi.py'), 
        path.join(tmpDir, 'config/wsgi.py')
      );
    }
    
    // List created files for verification
    log('Files generated in tmp directory:', colors.green);
    await execAsync(`find ${tmpDir} -type f | grep -v "__pycache__" | sort`).then(({ stdout }) => {
      console.log(stdout);
    }).catch(err => {
      log(`Error listing files: ${err.message}`, colors.red);
    });
    
    log('Django packaging completed successfully', colors.green);
    return tmpDir;
  } catch (error) {
    log(`Error in createLambdaLayout: ${error.message}`, colors.red);
    throw error;
  }
}

// Execute if run directly
if (require.main === module) {
  log('Starting Django packaging...', colors.bright + colors.blue);
  createLambdaLayout().then(tmpDir => {
    log(`Django packaging complete. Files available at: ${tmpDir}`, colors.bright + colors.green);
  }).catch(err => {
    log(`Django packaging failed: ${err.message}`, colors.bright + colors.red);
    process.exit(1);
  });
}

module.exports = { createLambdaLayout }; 