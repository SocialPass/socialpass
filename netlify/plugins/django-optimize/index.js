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
      utils.build.failBuild('Staticfiles directory not found. Make sure collectstatic ran successfully.');
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
        } catch (error) {
          console.warn(`Warning: Could not create directory ${dir}: ${error.message}`);
        }
      }
    });
    
    // Check for admin directory, but don't fail if it doesn't exist
    const adminDir = path.join(staticfilesDir, 'admin');
    if (!fs.existsSync(adminDir)) {
      console.warn('Warning: Admin static files directory not found. This is okay if you are not using Django admin.');
    }
    
    // Check for sitemap.xml
    const sitemapFile = path.join(staticfilesDir, 'sitemap.xml');
    if (!fs.existsSync(sitemapFile)) {
      console.warn('Warning: sitemap.xml not found. Consider generating one for better SEO.');
      
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
    }
    
    // Check for robots.txt
    const robotsFile = path.join(staticfilesDir, 'robots.txt');
    if (!fs.existsSync(robotsFile)) {
      console.warn('Warning: robots.txt not found. Consider creating one for better SEO.');
    }
    
    // Additional Django-specific optimizations
    try {
      // Check for Django settings module
      if (!process.env.DJANGO_SETTINGS_MODULE) {
        utils.build.failBuild('DJANGO_SETTINGS_MODULE environment variable is not set.');
      }
      
      // Ensure static files are properly collected
      const staticFiles = fs.readdirSync(staticfilesDir);
      if (staticFiles.length === 0) {
        utils.build.failBuild('No static files found. collectstatic may have failed.');
      }
      
      console.log(`Found ${staticFiles.length} static files/directories.`);
    } catch (error) {
      utils.build.failBuild(`Django optimization error: ${error.message}`);
    }
    
    console.log('Django optimization plugin completed successfully!');
  }
}; 