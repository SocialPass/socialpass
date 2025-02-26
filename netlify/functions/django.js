// Core Node.js modules
const path = require('path');
const fs = require('fs');
// Optional require for child_process - handle gracefully if not available
let execSync;
try {
  const childProcess = require('child_process');
  execSync = childProcess.execSync;
} catch (error) {
  console.warn('child_process module not available, some functionality may be limited');
  execSync = () => {}; // Provide a no-op function
}

// Set up environment for Django
process.env.DJANGO_SETTINGS_MODULE = 'config.settings.netlify';

// Print debug information about environment
console.log('Current directory:', process.cwd());
console.log('Files in current directory:', fs.readdirSync('.').join(', '));

// Check if config directory exists
if (fs.existsSync('./config')) {
  console.log('Config directory exists. Contents:', fs.readdirSync('./config').join(', '));
  if (fs.existsSync('./config/wsgi.py')) {
    console.log('WSGI file exists');
  } else {
    console.log('WSGI file not found in config directory');
  }
} else {
  console.log('Config directory not found');
}

// Import serverless-http - essential for the function
let serverless;
try {
  serverless = require('serverless-http');
} catch (error) {
  console.error('serverless-http module is required but not available:', error);
  throw new Error('Missing required dependency: serverless-http');
}

// Create a mock Django application as a fallback
const createMockApp = () => {
  console.log('Creating mock Django application');
  return (req, res) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html');
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Django Serverless Error</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            .error { color: red; background: #ffeeee; padding: 10px; border-radius: 5px; }
            pre { background: #f4f4f4; padding: 10px; overflow: auto; }
          </style>
        </head>
        <body>
          <h1>Django Serverless Error</h1>
          <div class="error">
            <p>The Django application could not be loaded. The WSGI file was not found.</p>
          </div>
          <h2>Debug Information:</h2>
          <pre>
            Current directory: ${process.cwd()}
            Node.js version: ${process.version}
            Process environment: ${JSON.stringify(process.env, null, 2)}
          </pre>
        </body>
      </html>
    `);
  };
};

// Run the Django application with some setup first
const runDjango = () => {
  try {
    // Try multiple potential locations for the WSGI file
    const potentialPaths = [
      'wsgi_adapter.py',              // Our custom adapter
      'config/wsgi.py',               // Standard path
      './config/wsgi.py',             // Explicit relative path
      '../config/wsgi.py',            // One directory up
      path.resolve('config/wsgi.py'), // Resolved absolute path
      '/var/task/config/wsgi.py'      // Netlify Functions path
    ];
    
    console.log('Attempting to load Django WSGI application from potential paths');
    
    let djangoApp = null;
    let lastError = null;
    
    // Try each path until we find the module
    for (const wsgiPath of potentialPaths) {
      try {
        console.log(`Trying to load from: ${wsgiPath}`);
        
        // Check if file exists before trying to require it
        if (fs.existsSync(wsgiPath)) {
          console.log(`Path exists: ${wsgiPath}`);
          djangoApp = require(wsgiPath).application;
          console.log(`Successfully loaded Django application from ${wsgiPath}`);
          break;
        } else {
          console.log(`Path does not exist: ${wsgiPath}`);
        }
      } catch (error) {
        lastError = error;
        console.error(`Error loading from ${wsgiPath}:`, error.message);
      }
    }
    
    if (djangoApp) {
      return djangoApp;
    } else {
      console.error('Failed to load Django application from any path. Last error:', lastError);
      return createMockApp();
    }
  } catch (error) {
    console.error('Error loading Django application:', error);
    return createMockApp();
  }
};

// Create the serverless handler
let handler;
try {
  // Add timeout configuration for long-running operations
  const serverlessOptions = {
    timeout: 30, // 30 seconds timeout
    binary: true // Support binary responses
  };
  
  const app = runDjango();
  handler = serverless(app, serverlessOptions);
  console.log('Serverless handler created successfully');
} catch (error) {
  console.error('Failed to create serverless handler:', error);
  
  // Create a simple handler that returns an error page
  handler = async (event, context) => {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Serverless Function Error</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              .error { color: red; background: #ffeeee; padding: 10px; border-radius: 5px; }
              pre { background: #f4f4f4; padding: 10px; overflow: auto; }
            </style>
          </head>
          <body>
            <h1>Serverless Function Error</h1>
            <div class="error">
              <p>There was an error creating the serverless handler.</p>
              <p>${error.message}</p>
            </div>
            <h2>Debug Information:</h2>
            <pre>
              Current directory: ${process.cwd()}
              Node.js version: ${process.version}
              Event: ${JSON.stringify(event, null, 2)}
            </pre>
          </body>
        </html>
      `
    };
  };
}

// Export the handler function
exports.handler = async (event, context) => {
  // Set specific Netlify environment variables if needed
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL environment variable not set!');
  }
  
  try {
    return await handler(event, context);
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Function Execution Error</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              .error { color: red; background: #ffeeee; padding: 10px; border-radius: 5px; }
              pre { background: #f4f4f4; padding: 10px; overflow: auto; }
            </style>
          </head>
          <body>
            <h1>Function Execution Error</h1>
            <div class="error">
              <p>There was an error executing the function.</p>
              <p>${error.message}</p>
            </div>
            <h2>Debug Information:</h2>
            <pre>
              Stack trace: ${error.stack}
              Current directory: ${process.cwd()}
              Node.js version: ${process.version}
            </pre>
          </body>
        </html>
      `
    };
  }
}; 