module.exports = {
  onPreBuild: ({ utils }) => {
    console.log('Starting Django optimization plugin...');
  },
  
  onBuild: ({ utils }) => {
    console.log('Running Django optimizations...');
    
    // You can add custom build steps here
    // For example, compressing static files, running Django checks, etc.
  },
  
  onPostBuild: ({ utils, constants }) => {
    console.log('Finalizing Django optimizations...');
    
    // Check for common Django deployment issues
    const fs = require('fs');
    const path = require('path');
    
    // Ensure staticfiles directory exists
    const staticfilesDir = path.join(constants.PUBLISH_DIR);
    if (!fs.existsSync(staticfilesDir)) {
      utils.build.failBuild('Staticfiles directory not found. Make sure collectstatic ran successfully.');
    }
    
    // Check for critical Django files
    const requiredFiles = [
      path.join(staticfilesDir, 'admin'),
      path.join(staticfilesDir, 'css'),
      path.join(staticfilesDir, 'js')
    ];
    
    requiredFiles.forEach(file => {
      if (!fs.existsSync(file)) {
        utils.build.failBuild(`Required static file/directory not found: ${file}`);
      }
    });
    
    console.log('Django optimization plugin completed successfully!');
  }
}; 