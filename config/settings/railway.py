"""
Railway production settings for SocialPass.
"""

import os
import sys
import dj_database_url

from .production import *  # noqa
from .base import env, ROOT_DIR

# Railway-specific settings
DEBUG = False

# Security - SECRET_KEY is required for Django to start
SECRET_KEY = env("DJANGO_SECRET_KEY", default="")
if not SECRET_KEY:
    raise Exception(
        "DJANGO_SECRET_KEY environment variable is required for Railway deployment. "
        "Please set this to a secure random string in your Railway environment variables."
    )

# Railway provides DATABASE_URL automatically
# Skip database config during collectstatic (same as base.py)
if len(sys.argv) > 0 and sys.argv[1] != "collectstatic":
    # Get DATABASE_URL from Railway environment
    database_url = env("DATABASE_URL", default="")
    if database_url:
        DATABASES = {
            "default": dj_database_url.parse(
                database_url,
                conn_max_age=600,
                conn_health_checks=True,
            )
        }
    else:
        # Fallback configuration if DATABASE_URL is not available
        # This should not happen in Railway, but provides better error messaging
        raise Exception(
            "DATABASE_URL environment variable is required for Railway deployment. "
            "Please ensure PostgreSQL service is connected to your Railway app."
        )

# Railway domain configuration
RAILWAY_STATIC_URL = env("RAILWAY_STATIC_URL", default="")  # noqa
RAILWAY_PUBLIC_DOMAIN = env("RAILWAY_PUBLIC_DOMAIN", default="")  # noqa

if RAILWAY_PUBLIC_DOMAIN:
    ALLOWED_HOSTS = [RAILWAY_PUBLIC_DOMAIN, f"*.{RAILWAY_PUBLIC_DOMAIN}"]
else:
    # Railway's generated domains - handle various patterns
    ALLOWED_HOSTS = [
        "*.up.railway.app",  # Main Railway pattern
        "*.railway.app",     # Alternative pattern
        "socialpass-production.up.railway.app",  # Specific current URL
        "*"  # Fallback for demo (remove in production)
    ]

# Static files configuration for Railway
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(ROOT_DIR, "staticfiles")  # noqa

# Whitenoise configuration for serving static files
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Media files configuration for Railway
# Check if AWS S3 is configured, otherwise use local storage (demo mode)
aws_bucket = env("AWS_STORAGE_BUCKET_NAME", default="")
if aws_bucket:
    # Production: Use S3 storage
    DEFAULT_FILE_STORAGE = "config.storages.MediaRootS3Boto3Storage"
    MEDIA_URL = f"https://{aws_bucket}.s3.amazonaws.com/public/media/"
else:
    # Demo mode: Use local storage (files will be lost on Railway restart)
    DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"
    MEDIA_ROOT = os.path.join(ROOT_DIR, "media")
    MEDIA_URL = "/media/"

# Security settings for Railway
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
# Disable SSL redirect for easier demo setup (enable in production)
SECURE_SSL_REDIRECT = env.bool("DJANGO_SECURE_SSL_REDIRECT", default=False)
SESSION_COOKIE_SECURE = env.bool("SESSION_COOKIE_SECURE", default=False)
CSRF_COOKIE_SECURE = env.bool("CSRF_COOKIE_SECURE", default=False)

# CORS settings for Railway
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    f"https://{RAILWAY_PUBLIC_DOMAIN}" if RAILWAY_PUBLIC_DOMAIN else "",
]

# Remove empty strings
CORS_ALLOWED_ORIGINS = [origin for origin in CORS_ALLOWED_ORIGINS if origin]

# Email configuration for Railway
# Use console backend for demo (emails print to logs) or configure real email service
email_backend = env("DJANGO_EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend")
EMAIL_BACKEND = email_backend

# Stripe configuration (optional for demo)
# If not configured, only free tickets will work
STRIPE_LIVE_PUBLIC_KEY = env("STRIPE_PUBLIC_KEY", default="")
STRIPE_LIVE_SECRET_KEY = env("STRIPE_SECRET_KEY", default="")
STRIPE_TEST_PUBLIC_KEY = env("STRIPE_PUBLIC_KEY", default="")
STRIPE_TEST_SECRET_KEY = env("STRIPE_SECRET_KEY", default="")

# Authentication configuration for Railway demo
# Disable mandatory email verification since we're using console email backend
ACCOUNT_EMAIL_VERIFICATION = env("ACCOUNT_EMAIL_VERIFICATION", default="none")
# Allow immediate login after signup for demo
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = False
# Keep email as authentication method (email + password)
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False

# URL configuration for Railway demo
# Provide defaults for admin and staff URLs to prevent routing issues
ADMIN_URL = env("DJANGO_ADMIN_URL", default="admin/")
STAFF_URL = env("STAFF_URL", default="staff/")

# License configuration for Railway demo
# Disable license checking for demo mode
LICENSE_KEY = env("LICENSE_KEY", default="DEMO_MODE")

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
