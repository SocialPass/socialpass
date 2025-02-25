"""
Build-specific settings for SocialPass.

These settings are used during the Netlify build process only.
They disable database connections to avoid the need for PostgreSQL during static file collection.
"""

import os
import pathlib

# Define BASE_DIR explicitly
BASE_DIR = pathlib.Path(__file__).resolve().parent.parent.parent

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