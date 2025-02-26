#!/usr/bin/env node

/**
 * This script prepares the Django application for deployment as a Netlify function.
 * It copies necessary Python files to the functions directory.
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Define paths
const REPO_ROOT = path.resolve(__dirname, '../..');
const FUNCTIONS_DIR = path.join(REPO_ROOT, 'netlify', 'functions');
const DJANGO_FUNCTION_DIR = path.join(FUNCTIONS_DIR, 'django');
const CONFIG_DIR = path.join(REPO_ROOT, 'config');
const APPS_DIR = path.join(REPO_ROOT, 'apps');
const TEMPLATETAGS_DIR = path.join(REPO_ROOT, 'templatetags');
const TEMPLATES_DIR = path.join(REPO_ROOT, 'templates');
const MANAGE_PY = path.join(REPO_ROOT, 'manage.py');

console.log('Packaging Django application for Netlify Functions deployment');
console.log(`Repository root: ${REPO_ROOT}`);
console.log(`Functions directory: ${FUNCTIONS_DIR}`);

// Create the django function directory if it doesn't exist
fs.ensureDirSync(DJANGO_FUNCTION_DIR);
console.log(`Ensured directory exists: ${DJANGO_FUNCTION_DIR}`);

// Copy the Django function handler
const handlerSource = path.join(FUNCTIONS_DIR, 'django.js');
const handlerDest = path.join(DJANGO_FUNCTION_DIR, 'django.js');
fs.copySync(handlerSource, handlerDest);
console.log(`Copied function handler from ${handlerSource} to ${handlerDest}`);

// Create a directory structure for Django files
const djangoDest = path.join(DJANGO_FUNCTION_DIR, 'config');
fs.ensureDirSync(djangoDest);
console.log(`Created directory for Django files: ${djangoDest}`);

// Copy WSGI file and settings
fs.copySync(CONFIG_DIR, djangoDest, {
  filter: (src) => {
    // Skip __pycache__ directories and .pyc files
    return !src.includes('__pycache__') && !src.endsWith('.pyc');
  }
});
console.log(`Copied Django config files from ${CONFIG_DIR} to ${djangoDest}`);

// Copy Django apps if they exist
if (fs.existsSync(APPS_DIR)) {
  const appsDest = path.join(DJANGO_FUNCTION_DIR, 'apps');
  fs.ensureDirSync(appsDest);
  fs.copySync(APPS_DIR, appsDest, {
    filter: (src) => {
      // Skip __pycache__ directories and .pyc files
      return !src.includes('__pycache__') && !src.endsWith('.pyc');
    }
  });
  console.log(`Copied Django apps from ${APPS_DIR} to ${appsDest}`);
}

// Copy template tags if they exist
if (fs.existsSync(TEMPLATETAGS_DIR)) {
  const templatetagsDest = path.join(DJANGO_FUNCTION_DIR, 'templatetags');
  fs.ensureDirSync(templatetagsDest);
  fs.copySync(TEMPLATETAGS_DIR, templatetagsDest, {
    filter: (src) => {
      // Skip __pycache__ directories and .pyc files
      return !src.includes('__pycache__') && !src.endsWith('.pyc');
    }
  });
  console.log(`Copied template tags from ${TEMPLATETAGS_DIR} to ${templatetagsDest}`);
}

// Copy templates if they exist
if (fs.existsSync(TEMPLATES_DIR)) {
  const templatesDest = path.join(DJANGO_FUNCTION_DIR, 'templates');
  fs.ensureDirSync(templatesDest);
  fs.copySync(TEMPLATES_DIR, templatesDest);
  console.log(`Copied templates from ${TEMPLATES_DIR} to ${templatesDest}`);
}

// Copy manage.py
if (fs.existsSync(MANAGE_PY)) {
  fs.copySync(MANAGE_PY, path.join(DJANGO_FUNCTION_DIR, 'manage.py'));
  console.log(`Copied manage.py to the function directory`);
}

// Create a Python requirements file that specifies all the dependencies
// This will help Netlify's pip install step in the function
const requirementsContent = `
# Django and its dependencies
django==4.2.19
whitenoise==6.7.0
dj-database-url==2.1.0
python-dotenv==1.0.0
psycopg2-binary==2.9.9
psycopg==3.2.1

# From base.txt
argon2-cffi==23.1.0
boto3==1.28.73
django-allauth==64.0.0
django-crispy-forms==2.3
crispy-bootstrap5==2024.2
django-environ==0.11.2
django-model-utils==4.5.1
django-storages==1.14.4
procrastinate==2.11.0
PyJWT==2.9.0

# Additional dependencies from requirements
gunicorn==23.0.0
`;

fs.writeFileSync(
  path.join(DJANGO_FUNCTION_DIR, 'requirements.txt'),
  requirementsContent.trim()
);
console.log('Created requirements.txt for the function');

// Create a simple package.json for the function
const packageJson = {
  name: "django-function",
  version: "1.0.0",
  description: "Django application as a Netlify function",
  main: "django.js",
  dependencies: {
    "serverless-http": "^3.2.0",
    "fs-extra": "^10.0.0"
  }
};

fs.writeFileSync(
  path.join(DJANGO_FUNCTION_DIR, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);
console.log('Created package.json for the function');

// Add runtime.txt for Python version
fs.writeFileSync(
  path.join(DJANGO_FUNCTION_DIR, 'runtime.txt'),
  '3.11'
);
console.log('Created runtime.txt for the function');

// Create a simple configuration to tell Netlify this is a Python function
const netlifyFunctionConfig = {
  config: {
    runtime: "nodejs18.x"
  }
};

fs.writeFileSync(
  path.join(DJANGO_FUNCTION_DIR, 'function.json'),
  JSON.stringify(netlifyFunctionConfig, null, 2)
);
console.log('Created function.json for the function');

// Create a custom __init__.py at the function root to make it a Python package
fs.writeFileSync(
  path.join(DJANGO_FUNCTION_DIR, '__init__.py'),
  '# This file makes the directory a Python package\n'
);
console.log('Created __init__.py for the function root');

// Create a modified wsgi.py that can adapt to the function environment
const wsgiAdapterContent = `
"""
WSGI adapter for the Netlify function environment
"""

import os
import sys
import inspect
from pathlib import Path

# Extensive path debugging
print("Python sys.path BEFORE modifications:")
for p in sys.path:
    print(f"  - {p}")

# Find the correct path to the application
current_dir = Path(__file__).resolve().parent
print(f"Current directory: {current_dir}")

# Add the current directory and parent directories to sys.path
sys.path.insert(0, str(current_dir))

# Check if /var/task exists (Lambda environment) and add it explicitly
var_task_path = Path('/var/task')
if var_task_path.exists():
    print(f"Found Lambda environment directory: {var_task_path}")
    sys.path.insert(0, str(var_task_path))

# Also add paths for the 'config' module
config_path = current_dir / 'config'
if config_path.exists():
    print(f"Found config directory: {config_path}")
    sys.path.insert(0, str(config_path.parent))

print("Python sys.path AFTER modifications:")
for p in sys.path:
    print(f"  - {p}")

# Set correct environment variables
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.netlify")

try:
    # Try to import wsgi module directly
    print("Attempting to import config.wsgi directly...")
    from config.wsgi import application
    print("Successfully imported wsgi module!")
except ImportError as e:
    print(f"Import error: {e}")
    
    # Try to find wsgi.py and load it dynamically
    print("Searching for wsgi.py...")
    wsgi_candidates = [
        current_dir / 'config' / 'wsgi.py',
        var_task_path / 'config' / 'wsgi.py',
        Path('/var/task/config/wsgi.py'),
        Path('/var/task/django/config/wsgi.py'),
    ]
    
    wsgi_found = False
    for wsgi_path in wsgi_candidates:
        if wsgi_path.exists():
            print(f"Found wsgi.py at: {wsgi_path}")
            wsgi_found = True
            # Create a fallback application
            from django.core.wsgi import get_wsgi_application
            os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.netlify")
            application = get_wsgi_application()
            break
            
    if not wsgi_found:
        print("WSGI file not found! Creating a fallback application...")
        # Create a simple WSGI application for debugging
        def application(environ, start_response):
            status = '500 Internal Server Error'
            output = b'WSGI application not found. This is a fallback response.'
            response_headers = [
                ('Content-type', 'text/plain'),
                ('Content-Length', str(len(output)))
            ]
            start_response(status, response_headers)
            return [output]
`;

// Also create a simple standalone wsgi.py for direct inclusion
const standaloneWsgiContent = `
"""
Standalone WSGI file for Netlify functions
"""

import os
import sys
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(current_dir))

# Set Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.netlify")

# Create WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
`;

fs.writeFileSync(
  path.join(DJANGO_FUNCTION_DIR, 'wsgi_adapter.py'),
  wsgiAdapterContent.trim()
);
console.log('Created wsgi_adapter.py to help with function environment');

fs.writeFileSync(
  path.join(DJANGO_FUNCTION_DIR, 'wsgi.py'),
  standaloneWsgiContent.trim()
);
console.log('Created standalone wsgi.py for direct use');

// Create a special file structure for Lambda deployment
console.log('Creating special file structure for Lambda deployment...');

// First copy all the content to a temporary directory to reorganize it
const tempDir = path.join(DJANGO_FUNCTION_DIR, '_temp');
fs.ensureDirSync(tempDir);

// Copy the function handler to the root
fs.copySync(handlerDest, path.join(tempDir, 'django.js'));

// Now prepare a flat directory structure that will work better in Lambda
fs.copySync(path.join(DJANGO_FUNCTION_DIR, 'config'), path.join(tempDir, 'config'));
if (fs.existsSync(path.join(DJANGO_FUNCTION_DIR, 'apps'))) {
  fs.copySync(path.join(DJANGO_FUNCTION_DIR, 'apps'), path.join(tempDir, 'apps'));
}
if (fs.existsSync(path.join(DJANGO_FUNCTION_DIR, 'templates'))) {
  fs.copySync(path.join(DJANGO_FUNCTION_DIR, 'templates'), path.join(tempDir, 'templates'));
}
if (fs.existsSync(path.join(DJANGO_FUNCTION_DIR, 'templatetags'))) {
  fs.copySync(path.join(DJANGO_FUNCTION_DIR, 'templatetags'), path.join(tempDir, 'templatetags'));
}

// Copy the adapter and standalone WSGI files
fs.copySync(path.join(DJANGO_FUNCTION_DIR, 'wsgi_adapter.py'), path.join(tempDir, 'wsgi_adapter.py'));
fs.copySync(path.join(DJANGO_FUNCTION_DIR, 'wsgi.py'), path.join(tempDir, 'wsgi.py'));
// Also place wsgi.py in the config directory to ensure it can be found by relative imports
fs.copySync(path.join(DJANGO_FUNCTION_DIR, 'wsgi.py'), path.join(tempDir, 'config', 'wsgi.py'));

// Copy the other configuration files
fs.copySync(path.join(DJANGO_FUNCTION_DIR, 'requirements.txt'), path.join(tempDir, 'requirements.txt'));
fs.copySync(path.join(DJANGO_FUNCTION_DIR, 'package.json'), path.join(tempDir, 'package.json'));
fs.copySync(path.join(DJANGO_FUNCTION_DIR, 'runtime.txt'), path.join(tempDir, 'runtime.txt'));
fs.copySync(path.join(DJANGO_FUNCTION_DIR, 'function.json'), path.join(tempDir, 'function.json'));
fs.copySync(path.join(DJANGO_FUNCTION_DIR, '__init__.py'), path.join(tempDir, '__init__.py'));
// Add __init__.py to config directory
fs.writeFileSync(path.join(tempDir, 'config', '__init__.py'), '# Make config a package\n');

// Now replace the original function directory with our reorganized version
fs.removeSync(DJANGO_FUNCTION_DIR);
fs.moveSync(tempDir, DJANGO_FUNCTION_DIR);

console.log('Django application packaging complete with optimized Lambda structure');

// Create a direct entry point for Django in the functions directory
console.log('Creating direct entry point in the functions directory...');
fs.copySync(path.join(DJANGO_FUNCTION_DIR, 'django.js'), path.join(FUNCTIONS_DIR, 'django-direct.js'));
console.log('Created direct entry point at django-direct.js'); 