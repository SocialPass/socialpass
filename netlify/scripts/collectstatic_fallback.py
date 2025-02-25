#!/usr/bin/env python
"""
Collectstatic Fallback Script

This script provides a basic fallback for when the Django collectstatic command fails.
It ensures that basic static files are available in the staticfiles directory so the 
build doesn't fail completely.
"""

import os
import shutil
import sys
from pathlib import Path

# Get the project root directory
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
STATIC_DIR = ROOT_DIR / "static"
STATICFILES_DIR = ROOT_DIR / "staticfiles"

def ensure_dir(directory):
    """Ensure a directory exists."""
    directory.mkdir(parents=True, exist_ok=True)
    print(f"Ensured directory exists: {directory}")

def copy_fallback_files():
    """Copy fallback static files to the staticfiles directory."""
    print("Copying fallback static files...")
    
    # Create required directories
    ensure_dir(STATICFILES_DIR)
    ensure_dir(STATICFILES_DIR / "css")
    ensure_dir(STATICFILES_DIR / "js")
    
    # Copy fallback CSS
    fallback_css_src = STATIC_DIR / "css" / "netlify-fallback.css"
    if fallback_css_src.exists():
        shutil.copy2(fallback_css_src, STATICFILES_DIR / "css" / "base.css")
        print(f"Copied {fallback_css_src} to {STATICFILES_DIR}/css/base.css")
    else:
        # Create a basic CSS file if the fallback doesn't exist
        basic_css = """
        body { font-family: sans-serif; margin: 0; padding: 20px; }
        h1 { color: #333; }
        """
        with open(STATICFILES_DIR / "css" / "base.css", "w") as f:
            f.write(basic_css)
        print("Created basic CSS file at staticfiles/css/base.css")
    
    # Copy other static files if they exist
    static_files = {
        "base.css": {"src": STATIC_DIR / "css" / "base.css", "dest": STATICFILES_DIR / "css" / "base.css"},
        "main.js": {"src": STATIC_DIR / "js" / "main.js", "dest": STATICFILES_DIR / "js" / "main.js"},
        "robots.txt": {"src": STATIC_DIR / "robots.txt", "dest": STATICFILES_DIR / "robots.txt"},
        "404.html": {"src": STATIC_DIR / "404.html", "dest": STATICFILES_DIR / "404.html"}
    }
    
    for name, paths in static_files.items():
        if paths["src"].exists():
            shutil.copy2(paths["src"], paths["dest"])
            print(f"Copied {paths['src']} to {paths['dest']}")
        else:
            print(f"Warning: Source file {paths['src']} not found")
    
    # Create a basic 404 page if it doesn't exist
    if not (STATICFILES_DIR / "404.html").exists():
        basic_404 = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found</title>
    <link rel="stylesheet" href="/static/css/base.css">
</head>
<body>
    <div class="container">
        <div class="error-container">
            <h1 class="error-code">404</h1>
            <p class="error-message">Page not found</p>
            <a href="/" class="home-button">Return to Home</a>
        </div>
    </div>
</body>
</html>"""
        with open(STATICFILES_DIR / "404.html", "w") as f:
            f.write(basic_404)
        print("Created basic 404.html page")
    
    # Create a basic sitemap if it doesn't exist
    if not (STATICFILES_DIR / "sitemap.xml").exists():
        basic_sitemap = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2023-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>"""
        with open(STATICFILES_DIR / "sitemap.xml", "w") as f:
            f.write(basic_sitemap)
        print("Created basic sitemap.xml file")
    
    print("Fallback static files have been copied/created successfully")

if __name__ == "__main__":
    print(f"Starting collectstatic fallback script...")
    print(f"Python version: {sys.version}")
    print(f"Project root: {ROOT_DIR}")
    
    copy_fallback_files()
    
    print("Fallback script completed") 