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
try {
  console.log('Files in current directory:', fs.readdirSync('.').join(', '));
  
  // Add recursive directory listing for better debugging
  const listDirRecursive = (dir, level = 0) => {
    const indent = '  '.repeat(level);
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      try {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          console.log(`${indent}[DIR] ${item}/`);
          if (level < 2) { // Limit recursion depth to avoid too much output
            listDirRecursive(fullPath, level + 1);
          }
        } else {
          console.log(`${indent}[FILE] ${item} (${stats.size} bytes)`);
        }
      } catch (err) {
        console.log(`${indent}[ERROR] ${item}: ${err.message}`);
      }
    });
  };
  
  console.log('Recursive directory listing:');
  listDirRecursive('.');
} catch (error) {
  console.error('Error listing directory contents:', error);
}

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
      'wsgi.py',                     // Our standalone wsgi.py
      'wsgi_adapter.py',             // Our custom adapter
      'config/wsgi.py',              // Standard path 
      './config/wsgi.py',            // Explicit relative path
      '../config/wsgi.py',           // One directory up
      path.resolve('config/wsgi.py'), // Resolved absolute path
      '/var/task/wsgi.py',           // Lambda path with our standalone wsgi
      '/var/task/wsgi_adapter.py',   // Lambda path with our adapter
      '/var/task/config/wsgi.py',    // Lambda path with standard location
      '/var/task/django/wsgi.py',    // Lambda path with django subfolder
      '/var/task/django/config/wsgi.py' // Lambda path with django/config structure
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
          try {
            // Try to load module using require
            const wsgiModule = require(wsgiPath);
            
            // If an application property exists, use it
            if (wsgiModule && wsgiModule.application) {
              console.log(`Successfully loaded Django application from ${wsgiPath}`);
              djangoApp = wsgiModule.application;
              break;
            } else {
              console.log(`Module loaded from ${wsgiPath} but no application property found!`);
            }
          } catch (requireError) {
            console.error(`Error requiring module from ${wsgiPath}:`, requireError.message);
            lastError = requireError;
          }
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
      
      // As a last resort, try to create the app using child_process to run Python
      try {
        if (typeof execSync === 'function') {
          console.log('Attempting to create WSGI application using Python subprocess...');
          
          // Create a temporary Python script to generate a WSGI application
          const tempScriptPath = '/tmp/create_wsgi.py';
          const pythonScript = `
import os
import sys
import django
from django.core.wsgi import get_wsgi_application

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.netlify')

# Print debug information
print("Python version:", sys.version)
print("Django version:", django.get_version())
print("Python path:", sys.path)
print("Current directory:", os.getcwd())

# Try to create WSGI application
try:
    application = get_wsgi_application()
    print("Successfully created WSGI application")
except Exception as e:
    print("Error creating WSGI application:", e)
    raise
          `;
          
          fs.writeFileSync(tempScriptPath, pythonScript);
          console.log('Created temporary Python script at', tempScriptPath);
          
          // Execute the Python script
          const pythonOutput = execSync(`python ${tempScriptPath}`, { encoding: 'utf8' });
          console.log('Python subprocess output:', pythonOutput);
          
          // If we got here, Python script ran but we still can't use its application directly
          // So we'll fall back to the mock app
        }
      } catch (pythonError) {
        console.error('Python subprocess error:', pythonError.message);
      }
      
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