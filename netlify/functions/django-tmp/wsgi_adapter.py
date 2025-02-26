#!/usr/bin/env python
"""
WSGI adapter for Lambda deployment.
This adapter attempts to dynamically locate and load the Django WSGI application
from multiple possible locations in the Lambda environment.
"""

import os
import sys
import glob
import traceback

# Print debugging information
print("WSGI Adapter - Python version:", sys.version)
print("WSGI Adapter - Current directory:", os.getcwd())
print("WSGI Adapter - Directory contents:", os.listdir("."))

# Print sys.path for debugging
print("WSGI Adapter - Initial sys.path:", sys.path)

# Print environment variables related to Django
for key, value in os.environ.items():
    if "DJANGO" in key or "PYTHON" in key:
        print(f"WSGI Adapter - Environment: {key}={value}")

# Adjust sys.path to include likely locations
possible_paths = [
    os.getcwd(),
    os.path.join(os.getcwd(), "django"),
    os.path.join(os.getcwd(), "config"),
    "/var/task",
    "/var/task/django",
    "/var/task/config",
]

for path in possible_paths:
    if path not in sys.path and os.path.exists(path):
        sys.path.insert(0, path)
        print(f"WSGI Adapter - Added path: {path}")

# Set Django settings module
if "DJANGO_SETTINGS_MODULE" not in os.environ:
    os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings.netlify"
    print(f"WSGI Adapter - Set DJANGO_SETTINGS_MODULE to {os.environ['DJANGO_SETTINGS_MODULE']}")

# Try to locate the WSGI application
try:
    # First try the standard Django WSGI application
    print("WSGI Adapter - Attempting to import Django WSGI application")
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
    print("WSGI Adapter - Successfully loaded Django WSGI application")
except Exception as e:
    print(f"WSGI Adapter - Error loading Django WSGI application: {e}")
    print(f"WSGI Adapter - Traceback: {traceback.format_exc()}")
    
    # Search for wsgi.py files
    print("WSGI Adapter - Searching for wsgi.py files")
    wsgi_files = []
    
    for path in possible_paths:
        if os.path.exists(path):
            wsgi_files.extend(glob.glob(os.path.join(path, "**/wsgi.py"), recursive=True))
    
    print(f"WSGI Adapter - Found wsgi.py files: {wsgi_files}")
    
    # Try to load the first found wsgi.py file
    if wsgi_files:
        try:
            import importlib.util
            
            wsgi_path = wsgi_files[0]
            print(f"WSGI Adapter - Loading WSGI from {wsgi_path}")
            
            # Create a module name based on the file path
            module_name = f"wsgi_module_{hash(wsgi_path)}"
            
            # Load module from path
            spec = importlib.util.spec_from_file_location(module_name, wsgi_path)
            wsgi_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(wsgi_module)
            
            # Get application
            if hasattr(wsgi_module, "application"):
                application = wsgi_module.application
                print(f"WSGI Adapter - Successfully loaded application from {wsgi_path}")
            else:
                raise AttributeError(f"No application attribute in {wsgi_path}")
        except Exception as load_error:
            print(f"WSGI Adapter - Error loading WSGI from file: {load_error}")
            print(f"WSGI Adapter - Traceback: {traceback.format_exc()}")
            
            # Create a simple application as fallback
            def simple_app(environ, start_response):
                status = '200 OK'
                headers = [('Content-type', 'text/html')]
                start_response(status, headers)
                return [b"<html><body><h1>Django Serverless Error</h1><p>Failed to load WSGI application.</p></body></html>"]
            
            application = simple_app
    else:
        # No wsgi.py found, create a simple application
        print("WSGI Adapter - No wsgi.py files found, creating simple application")
        
        def simple_app(environ, start_response):
            status = '200 OK'
            headers = [('Content-type', 'text/html')]
            start_response(status, headers)
            html = f"""
            <html>
            <body>
                <h1>Django Serverless Error</h1>
                <p>Could not find any wsgi.py files.</p>
                <h2>System Information</h2>
                <ul>
                    <li>Current directory: {os.getcwd()}</li>
                    <li>Python version: {sys.version}</li>
                    <li>sys.path: {sys.path}</li>
                </ul>
            </body>
            </html>
            """
            return [html.encode('utf-8')]
        
        application = simple_app 