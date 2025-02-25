// Core Node.js modules
const path = require('path');
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

// Import serverless-http - essential for the function
let serverless;
try {
  serverless = require('serverless-http');
} catch (error) {
  console.error('serverless-http module is required but not available:', error);
  throw new Error('Missing required dependency: serverless-http');
}

// Run the Django application with some setup first
const runDjango = () => {
  try {
    // Dynamic import is required here
    let djangoApp;
    try {
      djangoApp = require(path.resolve('config/wsgi.py')).application;
    } catch (error) {
      console.error('Error loading Django application from wsgi.py:', error);
      throw error;
    }
    return djangoApp;
  } catch (error) {
    console.error('Error loading Django application:', error);
    throw error;
  }
};

// Create the serverless handler
let handler;
try {
  handler = serverless(runDjango());
} catch (error) {
  console.error('Failed to create serverless handler:', error);
  throw error;
}

// Export the handler function
exports.handler = async (event, context) => {
  // Set specific Netlify environment variables if needed
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL environment variable not set!');
  }
  
  return await handler(event, context);
}; 