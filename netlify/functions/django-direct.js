const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Diagnostic information
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());
console.log('Function file location:', __filename);

// Function to recursively list directory contents
function listDirectoryContents(dirPath, indent = '') {
  if (!fs.existsSync(dirPath)) {
    console.log(`${indent}Directory not found: ${dirPath}`);
    return;
  }
  
  const items = fs.readdirSync(dirPath);
  console.log(`${indent}Contents of ${dirPath}:`);
  
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      console.log(`${indent}📁 ${item}/`);
      // Limit recursion depth to avoid overwhelming output
      if (indent.length < 6) {
        listDirectoryContents(itemPath, indent + '  ');
      }
    } else {
      console.log(`${indent}📄 ${item} (${stats.size} bytes)`);
    }
  });
}

// Set environment variables
process.env.DJANGO_SETTINGS_MODULE = 'config.settings.netlify';

// List directory contents for debugging
console.log('====== Directory Structure ======');
listDirectoryContents(process.cwd());
console.log('=================================');

// Attempt to find and load the WSGI application
let djangoApp;
try {
  console.log('Trying to load standalone WSGI adapter...');
  if (fs.existsSync('./wsgi_adapter.py')) {
    console.log('Found wsgi_adapter.py, loading...');
    const { application } = require('./wsgi_adapter.py');
    djangoApp = application;
    console.log('Successfully loaded WSGI application from adapter');
  } else if (fs.existsSync('./wsgi.py')) {
    console.log('Found wsgi.py, loading...');
    const { application } = require('./wsgi.py');
    djangoApp = application;
    console.log('Successfully loaded WSGI application from standalone WSGI');
  } else {
    console.log('No adapter found, trying default locations...');
    const { application } = require('./config/wsgi.py');
    djangoApp = application;
    console.log('Successfully loaded WSGI application from config/wsgi.py');
  }
} catch (error) {
  console.error('Error loading Django application:', error);
  
  // Create a simple WSGI application that returns an error page
  djangoApp = (environ, start_response) => {
    const status = '500 Internal Server Error';
    const headers = [['Content-Type', 'text/html']];
    start_response(status, headers);
    
    const errorHtml = `
    <html>
      <head>
        <title>Django Serverless Error</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 650px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 { color: #e74c3c; }
          pre {
            background-color: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 15px;
            overflow: auto;
          }
        </style>
      </head>
      <body>
        <h1>Django Serverless Error</h1>
        <p>The Django WSGI application could not be loaded.</p>
        <h2>Error details:</h2>
        <pre>${error.stack || error.message}</pre>
        <h2>Environment:</h2>
        <pre>Node.js: ${process.version}
Current directory: ${process.cwd()}
DJANGO_SETTINGS_MODULE: ${process.env.DJANGO_SETTINGS_MODULE}
</pre>
      </body>
    </html>
    `;
    
    return [Buffer.from(errorHtml, 'utf8')];
  };
}

// Export handler
exports.handler = async (event, context) => {
  // Prepare environ object for WSGI
  const environ = {
    REQUEST_METHOD: event.httpMethod,
    SCRIPT_NAME: '',
    PATH_INFO: event.path,
    QUERY_STRING: new URLSearchParams(event.queryStringParameters || {}).toString(),
    CONTENT_LENGTH: event.body ? Buffer.byteLength(event.body).toString() : '0',
    CONTENT_TYPE: event.headers['content-type'] || '',
    SERVER_NAME: 'netlify',
    SERVER_PORT: '443',
    SERVER_PROTOCOL: 'HTTP/1.1',
    wsgi: {
      version: [1, 0],
      url_scheme: 'https',
      input: event.body || '',
      errors: process.stderr,
    },
  };
  
  // Add headers to environ
  Object.keys(event.headers || {}).forEach(key => {
    const wsgiKey = 'HTTP_' + key.toUpperCase().replace(/-/g, '_');
    environ[wsgiKey] = event.headers[key];
  });
  
  return new Promise((resolve, reject) => {
    let statusCode = 500;
    let responseHeaders = {};
    let body = [];
    
    function start_response(status, headers) {
      statusCode = parseInt(status.split(' ')[0], 10);
      headers.forEach(([key, value]) => {
        responseHeaders[key.toLowerCase()] = value;
      });
    }
    
    try {
      // Call the Django WSGI application
      const responseIterable = djangoApp(environ, start_response);
      
      for (const chunk of responseIterable) {
        body.push(chunk);
      }
      
      // Check if cleanup method exists and call it
      if (typeof responseIterable.close === 'function') {
        responseIterable.close();
      }
      
      // Join all response chunks
      const bodyBuffer = Buffer.concat(body);
      let bodyContent;
      
      // Handle response based on content type
      const contentType = responseHeaders['content-type'] || '';
      if (contentType.includes('application/json')) {
        bodyContent = bodyBuffer.toString('utf8');
        try {
          // Ensure it's valid JSON
          JSON.parse(bodyContent);
        } catch (e) {
          console.error('Response claimed to be JSON but was not valid:', e);
        }
      } else if (contentType.includes('text/')) {
        bodyContent = bodyBuffer.toString('utf8');
      } else {
        // For binary data, use base64 encoding
        bodyContent = bodyBuffer.toString('base64');
        responseHeaders['content-encoding'] = 'base64';
      }
      
      resolve({
        statusCode,
        headers: responseHeaders,
        body: bodyContent,
      });
    } catch (err) {
      console.error('Error during WSGI application execution:', err);
      reject(new Error(`WSGI application error: ${err.message}`));
    }
  });
}; 