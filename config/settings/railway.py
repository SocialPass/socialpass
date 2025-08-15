"""
Railway production settings for SocialPass.
"""

import os
import dj_database_url

from .production import *  # noqa
from .base import env, BASE_DIR

# Railway-specific settings
DEBUG = False

# Railway provides DATABASE_URL automatically
DATABASES = {
    "default": dj_database_url.parse(
        env("DATABASE_URL"),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Railway domain configuration
RAILWAY_STATIC_URL = env("RAILWAY_STATIC_URL", default="")  # noqa
RAILWAY_PUBLIC_DOMAIN = env("RAILWAY_PUBLIC_DOMAIN", default="")  # noqa

if RAILWAY_PUBLIC_DOMAIN:
    ALLOWED_HOSTS = [RAILWAY_PUBLIC_DOMAIN, f"*.{RAILWAY_PUBLIC_DOMAIN}"]
else:
    # Fallback for Railway's generated domains
    ALLOWED_HOSTS = ["*.railway.app", "*.up.railway.app"]

# Static files configuration for Railway
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")  # noqa

# Whitenoise configuration for serving static files
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Media files - Railway doesn't provide persistent storage, so use S3
DEFAULT_FILE_STORAGE = "config.storages.MediaRootS3Boto3Storage"

# Security settings for production
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# CORS settings for Railway
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    f"https://{RAILWAY_PUBLIC_DOMAIN}" if RAILWAY_PUBLIC_DOMAIN else "",
]

# Remove empty strings
CORS_ALLOWED_ORIGINS = [origin for origin in CORS_ALLOWED_ORIGINS if origin]

# Logging configuration
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}
