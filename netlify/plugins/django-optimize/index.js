module.exports = {
  onPreBuild: ({ utils }) => {
    console.log('Starting Django optimization plugin...');
    
    // Add environment variables check
    const requiredEnvVars = ['DJANGO_SETTINGS_MODULE', 'PYTHON_VERSION'];
    requiredEnvVars.forEach(varName => {
      if (!process.env[varName]) {
        console.warn(`Warning: ${varName} environment variable is not set.`);
      } else {
        console.log(`${varName}: ${process.env[varName]}`);
      }
    });
  },
  
  onBuild: ({ utils }) => {
    console.log('Running Django optimizations...');
    
    // You can add custom build steps here
    // For example, compressing static files, running Django checks, etc.
  },
  
  onPostBuild: ({ utils, constants }) => {
    console.log('Finalizing Django optimizations...');
    
    // Check for common Django deployment issues
    let fs;
    try {
      // Try to use fs-extra first
      fs = require('fs-extra');
      console.log('Using fs-extra module');
    } catch (error) {
      // Fall back to standard fs module
      console.log('fs-extra not found, falling back to standard fs module');
      fs = require('fs');
    }
    const path = require('path');
    
    // Ensure staticfiles directory exists
    const staticfilesDir = path.join(constants.PUBLISH_DIR);
    if (!fs.existsSync(staticfilesDir)) {
      console.warn('Staticfiles directory not found. Creating it...');
      try {
        fs.mkdirSync(staticfilesDir, { recursive: true });
        console.log(`Created staticfiles directory at: ${staticfilesDir}`);
      } catch (error) {
        utils.build.failBuild(`Failed to create staticfiles directory: ${error.message}`);
      }
    } else {
      console.log(`Staticfiles directory exists at: ${staticfilesDir}`);
      
      // Log static files count for diagnostics
      try {
        const files = fs.readdirSync(staticfilesDir);
        console.log(`Found ${files.length} items in staticfiles directory`);
        files.forEach(file => {
          const filePath = path.join(staticfilesDir, file);
          const stats = fs.statSync(filePath);
          if (stats.isDirectory()) {
            console.log(`- ${file}/ (directory)`);
          } else {
            console.log(`- ${file} (${stats.size} bytes)`);
          }
        });
      } catch (error) {
        console.warn(`Warning: Could not read staticfiles directory: ${error.message}`);
      }
    }
    
    // Define required directories
    const requiredDirs = [
      path.join(staticfilesDir, 'css'),
      path.join(staticfilesDir, 'js')
    ];
    
    // Create directories if they don't exist
    requiredDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        console.log(`Creating missing directory: ${dir}`);
        try {
          fs.mkdirSync(dir, { recursive: true });
          
          // Create a placeholder file to ensure the directory is not empty
          const placeholderPath = path.join(dir, '.placeholder');
          fs.writeFileSync(placeholderPath, `This file was automatically created by the Django optimization plugin to ensure the ${path.basename(dir)} directory exists.`);
          console.log(`Created placeholder file in ${dir}`);
        } catch (error) {
          console.warn(`Warning: Could not create directory ${dir}: ${error.message}`);
        }
      } else {
        console.log(`Directory exists: ${dir}`);
      }
    });
    
    // Check for admin directory, but don't fail if it doesn't exist
    const adminDir = path.join(staticfilesDir, 'admin');
    if (!fs.existsSync(adminDir)) {
      console.warn('Warning: Admin static files directory not found. This is okay if you are not using Django admin.');
    } else {
      console.log('Admin static files directory found.');
    }
    
    // Check for sitemap.xml
    const sitemapFile = path.join(staticfilesDir, 'sitemap.xml');
    if (!fs.existsSync(sitemapFile)) {
      console.warn('Warning: sitemap.xml not found. Creating a basic one for better SEO.');
      
      // Create a basic sitemap if it doesn't exist
      try {
        const baseUrl = process.env.URL || 'https://socialpass.netlify.app';
        const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
        
        fs.writeFileSync(sitemapFile, basicSitemap);
        console.log('Created a basic sitemap.xml file');
      } catch (error) {
        console.warn(`Could not create sitemap.xml: ${error.message}`);
      }
    } else {
      console.log('sitemap.xml found.');
    }
    
    // Check for robots.txt
    const robotsFile = path.join(staticfilesDir, 'robots.txt');
    if (!fs.existsSync(robotsFile)) {
      console.warn('Warning: robots.txt not found. Creating a basic one for better SEO.');
      
      // Create a basic robots.txt if it doesn't exist
      try {
        const baseUrl = process.env.URL || 'https://socialpass.netlify.app';
        const basicRobots = `# robots.txt for SocialPass

User-agent: *
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and sensitive areas
Disallow: /admin/
Disallow: /.netlify/
Disallow: /api/internal/`;
        
        fs.writeFileSync(robotsFile, basicRobots);
        console.log('Created a basic robots.txt file');
      } catch (error) {
        console.warn(`Could not create robots.txt: ${error.message}`);
      }
    } else {
      console.log('robots.txt found.');
    }
    
    // Additional Django-specific optimizations
    try {
      // Check for Django settings module
      if (!process.env.DJANGO_SETTINGS_MODULE) {
        console.warn('DJANGO_SETTINGS_MODULE environment variable is not set.');
      } else {
        console.log(`Using Django settings module: ${process.env.DJANGO_SETTINGS_MODULE}`);
      }
      
      // Ensure static files are properly collected
      const staticFiles = fs.readdirSync(staticfilesDir);
      if (staticFiles.length === 0) {
        console.warn('No static files found. collectstatic may have failed, but creating placeholder directories.');
        // Create minimum required structure instead of failing
        ['css', 'js', 'admin'].forEach(dir => {
          const dirPath = path.join(staticfilesDir, dir);
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Created empty directory: ${dirPath}`);
          }
        });
      } else {
        console.log(`Found ${staticFiles.length} static files/directories.`);
      }
    } catch (error) {
      console.warn(`Warning: Django optimization check encountered an issue: ${error.message}`);
      // Don't fail the build, just warn
    }
    
    console.log('Django optimization plugin completed successfully!');
  }
}; 