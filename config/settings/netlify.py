"""
Netlify settings for SocialPass.

These settings extend the production settings and configure Django to run smoothly on Netlify.
"""

import os
import dj_database_url
from dotenv import load_dotenv

from .production import *  # noqa

# Load environment variables from .env file
load_dotenv()

# GENERAL
# ------------------------------------------------------------------------------
DEBUG = False
ALLOWED_HOSTS = [".netlify.app", os.getenv("SITE_DOMAIN", "")]

# DATABASE
# ------------------------------------------------------------------------------
# Parse database configuration from DATABASE_URL
DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL"),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# STATIC FILES
# ------------------------------------------------------------------------------
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")  # noqa F405

# Make sure staticfiles directory exists
STATIC_ROOT = BASE_DIR / "staticfiles"  # noqa F405
os.makedirs(STATIC_ROOT, exist_ok=True)

# SECURITY
# ------------------------------------------------------------------------------
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# LOGGING
# ------------------------------------------------------------------------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
            "propagate": False,
        },
    },
} 