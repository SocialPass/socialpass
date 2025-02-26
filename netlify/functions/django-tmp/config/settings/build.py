"""
Build-specific settings for SocialPass.

These settings are used during the Netlify build process only.
They disable database connections to avoid the need for PostgreSQL during static file collection.
"""

import os
import pathlib
import sys
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Log Python path for debugging
logger.info("Python path: %s", sys.path)
logger.info("Current directory: %s", os.getcwd())

# Define BASE_DIR explicitly
BASE_DIR = pathlib.Path(__file__).resolve().parent.parent.parent
logger.info("BASE_DIR: %s", BASE_DIR)

# Import only the base settings we need for collectstatic
from django.conf import settings

# Configure minimal settings needed for collectstatic
SECRET_KEY = "build-only-not-used-in-production"
DEBUG = False
ALLOWED_HOSTS = ["*"]

# Disable database
DATABASES = {}

# Static files settings
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Log available apps
logger.info("Checking for apps in the project structure:")
apps_dir = BASE_DIR / "apps"
if apps_dir.exists():
    logger.info("Apps directory exists at: %s", apps_dir)
    for item in apps_dir.iterdir():
        if item.is_dir() and (item / "__init__.py").exists():
            logger.info("Found app: %s", item.name)

# Installed apps (minimal set needed for collectstatic)
INSTALLED_APPS = [
    "django.contrib.staticfiles",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.sitemaps",  # Add sitemap support
    # Include actual apps from the project
    "apps.root",
    "apps.dashboard_staff",
    "apps.marketing",
    "apps.checkout",
    "apps.dashboard_organizer",
]

logger.info("INSTALLED_APPS: %s", INSTALLED_APPS)

# Middleware (minimal set)
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.middleware.common.CommonMiddleware",
]

# Templates (minimal configuration)
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
            ],
        },
    },
]

# Make sure staticfiles directory exists
os.makedirs(STATIC_ROOT, exist_ok=True)
logger.info("Created staticfiles directory at: %s", STATIC_ROOT) 