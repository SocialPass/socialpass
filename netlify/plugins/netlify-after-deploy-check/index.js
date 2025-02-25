const fetch = require('node-fetch');

module.exports = {
  onSuccess: async ({ utils, constants }) => {
    console.log('Starting After Deploy Check plugin...');
    
    // Get the deployed URL
    const url = process.env.DEPLOY_URL || process.env.URL;
    if (!url) {
      console.warn('No deploy URL found. Skipping site check.');
      return;
    }

    console.log(`Deployed site URL: ${url}`);
    
    // Wait for the site to become available
    console.log('Waiting for site to become available (up to 5 minutes)...');
    let retries = 30; // 30 * 10 seconds = 5 minutes
    let siteAvailable = false;
    
    while (retries > 0 && !siteAvailable) {
      try {
        console.log(`Checking site availability - attempt ${31 - retries}...`);
        const response = await fetch(url, {
          timeout: 10000, // 10 second timeout
          headers: { 'User-Agent': 'Netlify Deploy Check' }
        });
        
        if (response.status >= 200 && response.status < 500) {
          console.log(`Site is available! Response status: ${response.status}`);
          siteAvailable = true;
          
          // Try to get the actual content
          try {
            const text = await response.text();
            console.log(`Response length: ${text.length} characters`);
            console.log(`First 100 characters: ${text.substring(0, 100)}...`);
            
            // Basic check for HTML structure
            if (text.includes('<html') && text.includes('<body')) {
              console.log('HTML structure looks valid!');
            } else {
              console.warn('HTML structure may be incomplete!');
            }
          } catch (contentError) {
            console.warn(`Could not read response content: ${contentError.message}`);
          }
        } else {
          console.log(`Site not yet ready. Status: ${response.status}`);
        }
      } catch (error) {
        console.log(`Connection error: ${error.message}`);
      }
      
      if (!siteAvailable) {
        console.log(`Waiting 10 seconds before next check (${retries - 1} attempts remaining)...`);
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        retries--;
      }
    }
    
    if (siteAvailable) {
      console.log('🎉 Site is up and running!');
    } else {
      console.warn('⚠️ Site could not be reached after multiple attempts.');
      console.warn('This could indicate an issue with the deployment or the serverless function.');
      console.warn('The build will still succeed, but you should check your function logs in the Netlify dashboard.');
      
      // Log helpful debugging tips
      console.log('\nDebugging tips:');
      console.log('1. Check function logs in the Netlify dashboard');
      console.log('2. Ensure your Django app is configured properly for serverless');
      console.log('3. Verify environment variables are set correctly');
      console.log('4. Check memory and timeout limits for your functions');
    }
    
    console.log('After Deploy Check plugin completed.');
  }
}; 