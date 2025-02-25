const path = require('path');
const { execSync } = require('child_process');

// Set up environment for Django
process.env.DJANGO_SETTINGS_MODULE = 'config.settings.netlify';

// Import serverless-http
const serverless = require('serverless-http');

// Run the Django application with some setup first
const runDjango = () => {
  try {
    // Dynamic import is required here
    const djangoApp = require(path.resolve('config/wsgi.py')).application;
    return djangoApp;
  } catch (error) {
    console.error('Error loading Django application:', error);
    throw error;
  }
};

// Create the serverless handler
const handler = serverless(runDjango());

// Export the handler function
exports.handler = async (event, context) => {
  // Set specific Netlify environment variables if needed
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL environment variable not set!');
  }
  
  return await handler(event, context);
}; 