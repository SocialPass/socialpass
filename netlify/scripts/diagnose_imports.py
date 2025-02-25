#!/usr/bin/env python
"""
Diagnostic script to find all imports of 'users' in the codebase.
Run this script during the Netlify build to help diagnose import errors.
"""

import os
import re
import sys
from pathlib import Path

# Get the project root directory
ROOT_DIR = Path(__file__).resolve().parent.parent.parent

def find_imports(directory, pattern):
    """Find all files containing imports matching the pattern."""
    print(f"Searching for imports matching '{pattern}' in {directory}")
    
    # Skip these directories
    skip_dirs = {'.git', 'node_modules', 'staticfiles', 'media', '__pycache__'}
    
    # File extensions to check
    extensions = {'.py'}
    
    # Regular expressions for different import styles
    import_patterns = [
        re.compile(r'import\s+' + pattern),
        re.compile(r'from\s+' + pattern + r'\s+import'),
        re.compile(r'from\s+\S+\s+import\s+.*\b' + pattern + r'\b')
    ]
    
    matches = []
    
    for root, dirs, files in os.walk(directory):
        # Skip directories we don't want to search
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        for i, pattern in enumerate(import_patterns):
                            if pattern.search(content):
                                matches.append((file_path, i))
                                break
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
    
    return matches

def check_installed_apps():
    """Check all settings files for INSTALLED_APPS entries."""
    settings_dir = ROOT_DIR / 'config' / 'settings'
    if not settings_dir.exists():
        print(f"Settings directory not found at {settings_dir}")
        return
    
    print(f"Checking INSTALLED_APPS in settings files:")
    
    for settings_file in settings_dir.glob('*.py'):
        try:
            with open(settings_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Simple regex to find INSTALLED_APPS
                installed_apps_match = re.search(r'INSTALLED_APPS\s*=\s*\[([^\]]+)\]', content, re.DOTALL)
                if installed_apps_match:
                    apps_content = installed_apps_match.group(1)
                    print(f"\nIn {settings_file.name}:")
                    
                    # Extract app names
                    app_pattern = re.compile(r'"([^"]+)"')
                    for app_match in app_pattern.finditer(apps_content):
                        app_name = app_match.group(1)
                        print(f"  - {app_name}")
        except Exception as e:
            print(f"Error reading {settings_file}: {e}")

def main():
    print("=== Django Import Diagnostic Tool ===")
    print(f"Python version: {sys.version}")
    print(f"Current directory: {os.getcwd()}")
    print(f"Project root: {ROOT_DIR}")
    
    # Check for 'users' imports
    print("\n=== Searching for 'users' imports ===")
    users_imports = find_imports(ROOT_DIR, r'users')
    
    if users_imports:
        print(f"\nFound {len(users_imports)} files with 'users' imports:")
        for file_path, pattern_type in users_imports:
            rel_path = os.path.relpath(file_path, ROOT_DIR)
            import_type = ["import users", "from users import", "import ... users"][pattern_type]
            print(f"  - {rel_path} ({import_type})")
    else:
        print("No explicit 'users' imports found.")
    
    # Check INSTALLED_APPS in settings files
    print("\n=== Checking INSTALLED_APPS in settings files ===")
    check_installed_apps()
    
    print("\n=== Diagnostic complete ===")

if __name__ == "__main__":
    main() 