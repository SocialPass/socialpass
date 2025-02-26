#!/usr/bin/env python
"""
Standalone WSGI file for Lambda deployment.
This file is designed to be imported directly by the Node.js adapter.
"""

import os
import sys
import traceback

# Print debugging information
print("Python version:", sys.version)
print("Current directory:", os.getcwd())
print("Contents of current directory:", os.listdir("."))
print("Initial sys.path:", sys.path)

# Check for Lambda environment
if os.path.exists("/var/task"):
    print("Lambda environment detected")
    # Add Lambda task directory to path if not already there
    if "/var/task" not in sys.path:
        sys.path.insert(0, "/var/task")
        print("Added /var/task to sys.path")

# Configure Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.netlify")

# Try to import the WSGI application
try:
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
    print("Successfully created WSGI application")
except Exception as e:
    print(f"Error creating WSGI application: {e}")
    print(f"Traceback: {traceback.format_exc()}")
    
    # Fallback: Try to find the WSGI file
    print("Attempting fallback import...")
    try:
        # Try to find config directory
        import importlib.util
        import glob
        
        # Look for config/wsgi.py
        wsgi_candidates = glob.glob("**/config/wsgi.py", recursive=True)
        print(f"Found wsgi.py candidates: {wsgi_candidates}")
        
        if wsgi_candidates:
            wsgi_path = wsgi_candidates[0]
            print(f"Loading WSGI from {wsgi_path}")
            
            # Load the module from path
            spec = importlib.util.spec_from_file_location("config.wsgi", wsgi_path)
            wsgi_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(wsgi_module)
            
            # Get the application
            application = wsgi_module.application
            print("Successfully loaded WSGI application via fallback")
        else:
            # Create a simple WSGI application as last resort
            def simple_app(environ, start_response):
                status = '200 OK'
                headers = [('Content-type', 'text/html')]
                start_response(status, headers)
                return [b"<html><body><h1>Django Serverless Error</h1><p>Could not load WSGI application.</p></body></html>"]
            
            application = simple_app
            print("Created simple fallback WSGI application")
    except Exception as fallback_error:
        print(f"Fallback import failed: {fallback_error}")
        print(f"Fallback traceback: {traceback.format_exc()}")
        
        # Last resort simple WSGI application
        def simple_app(environ, start_response):
            status = '200 OK'
            headers = [('Content-type', 'text/html')]
            start_response(status, headers)
            return [b"<html><body><h1>Django Serverless Error</h1><p>Could not load WSGI application.</p></body></html>"]
        
        application = simple_app 